// Step 2 of the booking flow: arrange the shipment for real, using the
// shipment_id and rate_id from book-quote.ts. Fully automatic per Fsi's
// decision — no manual review step, this goes straight through.
//
// Handles the drop-off requirement automatically if the chosen rate needs
// one (confirmed some international rates do, e.g. DHL) — the customer
// never sees or picks a drop-off location; it's resolved server-side
// against Fsi's own Lagos pickup side, since that's where drop-off
// happens, not the destination.
//
// duty_payer is set to "sender" — per Fsi's confirmed understanding, the
// carrier texts a payment link directly to whoever's phone number is on
// the shipment once it clears customs abroad. Since the pickup contact's
// phone number is the customer's (see buildPickupContact), this already
// routes correctly without any extra handling.

import type { Handler } from "@netlify/functions";

const TERMINAL_V1_BASE =
  process.env.TERMINAL_API_BASE || "https://api.terminal.africa/v1";

// TODO: create a dedicated Formspree form for booking notifications and
// replace this — using a separate endpoint from the Contact page's, since
// these are a different kind of notification (a paid booking, not a general
// enquiry) and Fsi may want to route them differently later.
const BOOKING_NOTIFICATION_ENDPOINT =
  "https://formspree.io/f/REPLACE_WITH_BOOKING_FORM_ID";

interface ConfirmRequestBody {
  shipmentId?: string;
  rateId?: string;
  carrierSlug?: string;
  dropoffRequired?: boolean;
  customer?: { name?: string; phone?: string; email?: string };
  recipient?: {
    firstName?: string;
    lastName?: string;
    city?: string;
    country?: string;
  };
  totalCharged?: number;
}

async function notifyFsi(data: {
  shipmentId: string;
  trackingNumber: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  recipientName: string;
  recipientLocation: string;
  carrierName: string | null;
  totalCharged: number | undefined;
}) {
  try {
    await fetch(BOOKING_NOTIFICATION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `New shipment booked — ${data.shipmentId}`,
        shipment_id: data.shipmentId,
        tracking_number: data.trackingNumber || "Not yet available",
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail,
        recipient: data.recipientName,
        destination: data.recipientLocation,
        carrier: data.carrierName || "Unknown",
        total_charged: data.totalCharged
          ? `₦${data.totalCharged}`
          : "Not provided",
      }),
    });
  } catch (err) {
    // Notification failing should never block the customer's booking from
    // completing — log it, but don't fail the request over it.
    console.error("Fsi booking notification failed:", err);
  }
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

  let payload: ConfirmRequestBody;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  const {
    shipmentId,
    rateId,
    carrierSlug,
    dropoffRequired,
    customer,
    recipient,
    totalCharged,
  } = payload;

  if (
    !shipmentId ||
    !rateId ||
    !customer?.name ||
    !customer?.phone ||
    !customer?.email
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required confirmation details" }),
    };
  }

  const authHeaders = {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  try {
    let dropoffId: string | undefined;

    // If this rate requires a drop-off, resolve one automatically against
    // Fsi's own Lagos side — the customer never has to think about this.
    if (dropoffRequired && carrierSlug) {
      const dropoffRes = await fetch(
        `${TERMINAL_V1_BASE}/carriers/locations/drop-off?country=NG&state=Lagos&carrier=${carrierSlug}`,
        { headers: authHeaders }
      );
      if (dropoffRes.ok) {
        const dropoffData = await dropoffRes.json();
        dropoffId = dropoffData?.data?.[0]?.dropoff_id;
      }
      // If no drop-off location comes back, proceed without one — Terminal
      // will reject the arrange-pickup call with a clear error if it's
      // genuinely required, which is safer than guessing an ID.
    }

    const arrangeRes = await fetch(`${TERMINAL_V1_BASE}/shipments/pickup`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        shipment_id: shipmentId,
        rate_id: rateId,
        duty_payer: "sender",
        ...(dropoffId ? { dropoff_id: dropoffId } : {}),
      }),
    });

    if (!arrangeRes.ok) {
      const body = await arrangeRes.json().catch(() => ({}));
      return {
        statusCode: 502,
        body: JSON.stringify({
          error:
            body?.message || `Terminal booking failed (${arrangeRes.status})`,
        }),
      };
    }

    const arrangeData = await arrangeRes.json();
    const shipment = arrangeData?.data ?? {};
    const extras = shipment?.extras ?? {};
    const trackingNumber = extras.tracking_number || null;
    const carrierName = shipment?.metadata?.selected_rate?.carrier_name || null;

    // Fire the notification in the background — don't make the customer
    // wait on Fsi's email before seeing their confirmation.
    await notifyFsi({
      shipmentId,
      trackingNumber,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      recipientName:
        `${recipient?.firstName || ""} ${recipient?.lastName || ""}`.trim() ||
        "Not provided",
      recipientLocation: `${recipient?.city || ""}, ${
        recipient?.country || ""
      }`.trim(),
      carrierName,
      totalCharged,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipmentId,
        trackingNumber,
        carrierName,
        status: shipment?.status ?? null,
      }),
    };
  } catch (err) {
    console.error("Book confirm proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong booking that shipment",
      }),
    };
  }
};
