// Secure proxy for getting real shipping rates from Terminal Africa.
//
// Same reasoning as track-shipment.ts: Terminal's SECRET_KEY has full
// account access, so it must never reach the browser. This function holds
// it server-side and only returns the specific rate fields the Pricing
// page actually needs.
//
// Flow: create a draft "quick" shipment (pickup is always Fsi's own hub
// address — this is an international-only service, Fsi collects locally
// and ships from their own hub, never the customer's address) — then fetch
// real rates for that draft. Recipient identity fields (name/email/phone)
// don't affect the rate amount, so this function fills them with generic
// placeholders — the frontend only needs to ask for what actually affects
// price: destination location, weight, and declared value.

import type { Handler } from "@netlify/functions";
import { HUB_ADDRESS } from "../../src/data/brand";

const TERMINAL_V1_BASE =
  process.env.TERMINAL_API_BASE || "https://api.terminal.africa/v1";

interface RateRequestBody {
  destination?: {
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
  };
  parcel?: {
    description?: string;
    weight?: number;
    value?: number;
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
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

  let payload: RateRequestBody;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  const destination = payload.destination;
  const parcel = payload.parcel;

  if (
    !destination?.country ||
    !destination?.city ||
    !destination?.state ||
    !parcel?.weight
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Missing required shipment details (country, state, city, weight)",
      }),
    };
  }

  const authHeaders = {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  try {
    // Step 1: create a draft shipment. Recipient name/email/phone are
    // placeholders — they don't affect the rate, only location and weight do.
    const quickRes = await fetch(`${TERMINAL_V1_BASE}/shipments/quick`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        pickup_address: HUB_ADDRESS,
        delivery_address: {
          first_name: "Prospective",
          last_name: "Customer",
          email: "estimate@fsilogistics.ng",
          phone: "+10000000000",
          line1: "Address to be confirmed at booking",
          city: destination.city,
          state: destination.state,
          country: destination.country,
          zip: destination.zip || "",
        },
        parcel: {
          description: parcel.description || "Personal shipment",
          items: [
            {
              description: parcel.description || "Personal shipment",
              name: parcel.description || "Item",
              currency: "NGN",
              value: parcel.value || 1,
              quantity: 1,
              weight: parcel.weight,
            },
          ],
        },
      }),
    });

    if (!quickRes.ok) {
      const body = await quickRes.json().catch(() => ({}));
      return {
        statusCode: 502,
        body: JSON.stringify({
          error:
            body?.message ||
            `Terminal shipment creation failed (${quickRes.status})`,
        }),
      };
    }

    const quickData = await quickRes.json();
    const shipmentId = quickData?.data?.shipment_id;

    if (!shipmentId) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Terminal did not return a shipment reference",
        }),
      };
    }

    // Step 2: get real rates for that draft.
    const ratesRes = await fetch(
      `${TERMINAL_V1_BASE}/rates/shipment?shipment_id=${shipmentId}`,
      {
        headers: authHeaders,
      }
    );

    if (!ratesRes.ok) {
      const body = await ratesRes.json().catch(() => ({}));
      return {
        statusCode: 502,
        body: JSON.stringify({
          error:
            body?.message ||
            `Terminal rates lookup failed (${ratesRes.status})`,
        }),
      };
    }

    const ratesData = await ratesRes.json();
    const rates = Array.isArray(ratesData?.data) ? ratesData.data : [];

    // Only return what the pricing UI actually needs — never the full
    // Terminal payload, which includes account/user PII.
    const sanitizedRates = rates.map((r: Record<string, unknown>) => ({
      carrierName: r.carrier_name ?? null,
      carrierLogo: r.carrier_logo ?? null,
      carrierSlug: r.carrier_slug ?? null,
      amount: r.amount ?? null,
      currency: r.currency ?? "NGN",
      deliveryTime: r.delivery_time ?? null,
      pickupTime: r.pickup_time ?? null,
      dropoffRequired: r.dropoff_required ?? false,
      rateId: r.rate_id ?? null,
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipmentId,
        rates: sanitizedRates,
      }),
    };
  } catch (err) {
    console.error("Get rates proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong getting shipping rates",
      }),
    };
  }
};
