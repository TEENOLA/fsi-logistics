// Create a free form at https://formspree.io, then replace this with your
// own form endpoint. On mobile this runs silently in the background as a
// safety net (the customer never sees it) so an inquiry still reaches FSI
// by email even if the WhatsApp message is never actually sent from the
// customer's side. On desktop, this is the primary submission path.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mpqvrkpa";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  shipmentType: string;
  message: string;
}

export async function sendEmailFallback(data: ContactFormData): Promise<void> {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `New enquiry from ${data.name || "website contact form"}`,
      name: data.name || "Not provided",
      email: data.email || "Not provided",
      phone: data.phone || "Not provided",
      shipmentType: data.shipmentType,
      message: data.message || "None",
    }),
  });

  if (!response.ok) {
    // fetch() only rejects on a network failure — an HTTP error status like
    // 400 or 403 still resolves normally, so this has to be checked
    // explicitly or a rejected submission looks identical to a successful one.
    let detail = "";
    try {
      const body = await response.json();
      detail =
        body?.errors?.map((e: { message?: string }) => e.message).join(", ") ||
        "";
    } catch {
      // response wasn't JSON — ignore, we still have the status code
    }
    throw new Error(
      `Formspree responded ${response.status}${detail ? `: ${detail}` : ""}`
    );
  }
}
