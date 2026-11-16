// Step 1 of the booking flow: create a real (not placeholder) draft
// shipment using the customer's actual recipient details, then fetch real
// rates for it. This is deliberately separate from get-rates.ts (which
// powers the standalone Pricing page with placeholder recipient info) —
// booking needs the real recipient address from the start, since the same
// shipment_id carries through to Arrange Pickup in book-confirm.ts.
//
// Pickup contact is the hybrid Fsi confirmed: Fsi's own address & email
// (packages are dropped off from Fsi's hub), but the customer's name and
// phone number (so carriers and duty-payment SMS links reach the right
// person). See buildPickupContact in src/data/brand.ts.

import type { Handler } from "@netlify/functions";
import { buildPickupContact } from "../../src/data/brand";

const TERMINAL_V1_BASE =
  process.env.TERMINAL_API_BASE || "https://api.terminal.africa/v1";

interface QuoteRequestBody {
  customer?: {
    name?: string;
    phone?: string;
  };
  recipient?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
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

  let payload: QuoteRequestBody;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  const { customer, recipient, parcel } = payload;

  if (
    !customer?.name ||
    !customer?.phone ||
    !recipient?.firstName ||
    !recipient?.lastName ||
    !recipient?.email ||
    !recipient?.phone ||
    !recipient?.line1 ||
    !recipient?.city ||
    !recipient?.state ||
    !recipient?.country ||
    !parcel?.weight
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required booking details" }),
    };
  }

  const authHeaders = {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  try {
    const quickRes = await fetch(`${TERMINAL_V1_BASE}/shipments/quick`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        pickup_address: buildPickupContact(customer.name, customer.phone),
        delivery_address: {
          first_name: recipient.firstName,
          last_name: recipient.lastName,
          email: recipient.email,
          phone: recipient.phone,
          line1: recipient.line1,
          line2: recipient.line2 || "",
          city: recipient.city,
          state: recipient.state,
          country: recipient.country,
          zip: recipient.zip || "",
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

    const sanitizedRates = rates.map((r: Record<string, unknown>) => ({
      carrierName: r.carrier_name ?? null,
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
      body: JSON.stringify({ shipmentId, rates: sanitizedRates }),
    };
  } catch (err) {
    console.error("Book quote proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong getting shipping options",
      }),
    };
  }
};
