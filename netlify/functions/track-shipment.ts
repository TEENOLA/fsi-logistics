// Secure proxy for Terminal Africa's shipment tracking API.
//
// Terminal's API requires a SECRET_KEY (full account access — it can create
// shipments and spend the account wallet, not just read data), so it must
// never be sent to the browser. This function holds that key server-side,
// read from the TERMINAL_SECRET_KEY environment variable set in the Netlify
// dashboard — it should never be committed to the repo or pasted into chat.
//
// Flow: customers are given a tracking number, not Terminal's own internal
// shipment_id, so we first search shipments by that tracking number/reference
// to find the matching shipment_id, then fetch two things in parallel:
//   1. Track a Shipment — status + real event history (a slimmed-down
//      endpoint purpose-built for status checking)
//   2. Get Shipment — the fuller shipment document, which is the only place
//      the `extras` object (carrier tracking number/URL) reliably appears.
//      Confirmed via a real test: `extras` is durable on the shipment
//      record itself, not just momentarily present right after booking.
//
// The Get Shipment response also contains real sensitive data — full
// addresses for both parties, and Fsi's own account/wallet details — so
// this function only ever hand-picks the specific fields the tracking page
// needs (never the raw payload) from either call.
import type { Handler } from "@netlify/functions";

// Defaults to the live API, but can be pointed at Terminal's sandbox
// (https://sandbox.terminal.africa/v1) by setting TERMINAL_API_BASE in
// Netlify's environment variables — useful for testing against a demo/test
// key before switching to Fsi's real account.
const TERMINAL_V1_BASE =
  process.env.TERMINAL_API_BASE || "https://api.terminal.africa/v1";
const TERMINAL_V2_BASE = TERMINAL_V1_BASE.replace("/v1", "/v2");

export const handler: Handler = async (event) => {
  const trackingNumber = event.queryStringParameters?.number?.trim();

  if (!trackingNumber) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing tracking number" }),
    };
  }

  const secretKey = process.env.TERMINAL_SECRET_KEY;
  if (!secretKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server is not configured with a Terminal API key yet",
      }),
    };
  }

  const authHeaders = { Authorization: `Bearer ${secretKey}` };

  try {
    // Step 1: find the shipment by tracking number / reference.
    const searchRes = await fetch(
      `${TERMINAL_V2_BASE}/shipments?search=${encodeURIComponent(
        trackingNumber
      )}`,
      { headers: authHeaders }
    );

    if (!searchRes.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: `Terminal search failed (${searchRes.status})`,
        }),
      };
    }

    const searchData = await searchRes.json();
    const match = searchData?.data?.[0];

    if (!match?.shipment_id) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "No shipment found for that tracking number",
        }),
      };
    }

    // Step 2: fetch live status and the fuller shipment document in
    // parallel — Track a Shipment for status/events, Get Shipment for the
    // `extras` object (carrier tracking link), which Track a Shipment
    // doesn't include.
    const [trackRes, shipmentRes] = await Promise.all([
      fetch(`${TERMINAL_V1_BASE}/shipments/track/${match.shipment_id}`, {
        headers: authHeaders,
      }),
      fetch(`${TERMINAL_V1_BASE}/shipments/${match.shipment_id}`, {
        headers: authHeaders,
      }),
    ]);

    if (!trackRes.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: `Terminal tracking lookup failed (${trackRes.status})`,
        }),
      };
    }

    const trackData = await trackRes.json();
    const d = trackData?.data ?? {};

    // The Get Shipment call is a bonus, not essential — if it fails for any
    // reason, degrade gracefully and just omit the carrier link rather than
    // failing the whole tracking lookup over it.
    let extras: Record<string, unknown> = {};
    if (shipmentRes.ok) {
      const shipmentData = await shipmentRes.json();
      extras = shipmentData?.data?.extras ?? {};
    }

    // Only return what the public tracking page actually needs. Never pass
    // through the full Terminal payload — it includes PII for both parties
    // (full addresses, emails, phone numbers) that a customer looking up a
    // tracking number has no business seeing.
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: d.status ?? null, // draft | pending | confirmed | in-transit | delivered | cancelled
        carrierName: d.carrier?.name ?? null,
        pickupDate: d.pickup_date || null,
        deliveryDate: d.delivery_date || null,
        // Confirmed real, durable fields from Get Shipment's `extras` object.
        carrierTrackingNumber: (extras.tracking_number as string) || null,
        carrierTrackingUrl:
          (extras.carrier_tracking_url as string) ||
          (extras.tracking_url as string) ||
          null,
        // Confirmed real shape: each event has description, location,
        // created_at, and a carrier-specific status code (varies by
        // carrier — not the same enum as the top-level `status` above, so
        // it isn't used for stage mapping, only for display).
        events: Array.isArray(d.events)
          ? d.events.map((e: Record<string, unknown>) => ({
              description: e.description ?? null,
              location: e.location ?? null,
              createdAt: e.created_at ?? null,
            }))
          : [],
      }),
    };
  } catch (err) {
    console.error("Terminal tracking proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong looking up that shipment",
      }),
    };
  }
};
