export const BRAND = {
  name: "FSI Logistics",
  tagline: "Fast. Safe. Reliable.",
  phones: ["+234 905 058 8603", "+234 803 477 1422"],
  whatsapp: "2349050588603",
  instagram: "@fsi_logistics",
  instagramUrl: "https://instagram.com/fsi_logistics",
};

export function waLink(message: string) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const WA_DEFAULT_MESSAGE =
  "Hello FSI Logistics, I'd like to inquire about your logistics services.";

// Fsi's own dispatch/hub address — confirmed the same as what's shown on the
// Contact page. This is always the "pickup" side sent to Terminal for
// international shipments (Fsi collects locally, then ships from here) —
// never the customer's own address.
// TODO: confirm exact zip/postal code with Fsi — left blank for now.
export const HUB_ADDRESS = {
  first_name: "FSI",
  last_name: "Logistics",
  email: "hello@fsilogistics.ng", // TODO: confirm real dispatch email with Fsi
  phone: BRAND.phones[0].replace(/\s/g, ""),
  line1: "Shop A114, Ogba Shopping Mall",
  line2: "beside Sunday Market",
  city: "Ogba",
  state: "Lagos",
  country: "NG",
  zip: "",
};

// The pickup contact Terminal actually needs for a real booking is a
// deliberate hybrid, per Fsi's explicit decision: the physical address and
// email stay Fsi's own (since packages are dropped off from Fsi's hub, not
// the customer's home) — but the name and phone number on the shipment
// should be the customer's, so carriers (and duty-payment SMS links) reach
// the right person directly.
export function buildPickupContact(
  customerName: string,
  customerPhone: string
) {
  const [firstName, ...rest] = customerName.trim().split(" ");
  return {
    ...HUB_ADDRESS,
    first_name: firstName || HUB_ADDRESS.first_name,
    last_name: rest.join(" ") || HUB_ADDRESS.last_name,
    phone: customerPhone || HUB_ADDRESS.phone,
  };
}

// Placeholder until Fsi confirms their actual booking fee — this is the one
// number to update once they decide. Structure (subtotal + separate fee
// line) is confirmed; the amount is not.
export const BOOKING_FEE_PERCENTAGE = 0.12;

// Shared across Pricing and Booking — countries with confirmed working
// Terminal integration during testing. "Other" falls back to manual entry.
export const COUNTRIES = [
  { label: "United States", value: "US" },
  { label: "United Kingdom", value: "GB" },
  { label: "Canada", value: "CA" },
  { label: "Other", value: "" },
];

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "International", to: "/international" },
  { label: "Pricing", to: "/pricing" },
  { label: "Book a Shipment", to: "/booking" },
  { label: "Tracking", to: "/tracking" },
  { label: "Contact", to: "/contact" },
];

export const STATS = [
  { label: "Countries Served", value: 24, suffix: "+" },
  { label: "Deliveries Completed", value: 48000, suffix: "+" },
  { label: "Happy Customers", value: 12500, suffix: "+" },
  { label: "Years of Experience", value: 9, suffix: "" },
];

export const SERVICES = [
  {
    slug: "international-cargo",
    title: "International Cargo",
    short:
      "Reliable air and sea freight solutions for businesses and individuals.",
    detail:
      "We move cargo between Nigeria and destinations including the USA, UK, Canada, Europe and beyond. Every shipment includes full customs documentation, duty guidance, and a choice of door-to-door or hub pickup — so you're never left guessing what happens after handoff.",
  },
  {
    slug: "local-delivery",
    title: "Local Delivery",
    short: "Fast nationwide delivery across Nigeria.",
    detail:
      "From Lagos to every state in Nigeria, our local network gets packages moving the same day they're booked. Most deliveries arrive same-day to next-day, with live tracking so you always know exactly where a package is.",
  },
  {
    slug: "express-parcel",
    title: "Express Parcel Delivery",
    short: "Same-day and next-day delivery where available.",
    detail:
      "For time-critical shipments, our express lane prioritises pickup, handling and delivery ahead of standard freight. Ideal for documents, urgent business parcels, or anything that simply can't wait for standard scheduling.",
  },
  {
    slug: "air-freight",
    title: "Air Freight",
    short: "The fastest way to ship internationally.",
    detail:
      "Air cargo partnerships across major hubs mean your shipment typically clears and arrives within 3–7 business days, door-to-door. The right choice when speed matters more than shipment size — documents, samples, and time-sensitive commercial goods.",
  },
  {
    slug: "sea-freight",
    title: "Sea Freight",
    short: "Affordable shipping for bulk cargo.",
    detail:
      "For large or heavy shipments where cost matters more than speed, ocean freight is the most economical route between continents — typically 20–35 days depending on destination and customs processing. Ideal for bulk goods, furniture, and commercial-volume shipments.",
  },
  {
    slug: "import-export",
    title: "Import & Export",
    short: "International import/export logistics.",
    detail:
      "End-to-end support for businesses moving goods in and out of Nigeria — customs documentation, duty calculation, and clearance handled for you, so you can focus on the business side of trade, not the paperwork.",
  },
  {
    slug: "commercial-logistics",
    title: "Commercial Logistics",
    short: "Supply chain solutions for businesses.",
    detail:
      "Scheduled freight, warehousing coordination and bulk shipment management for growing companies — built for businesses that ship regularly and need a logistics partner, not just a one-off courier.",
  },
];

export const INTERNATIONAL_DESTINATIONS = [
  "USA",
  "UK",
  "Canada",
  "Europe",
  "Rest of World",
];

export const PROCESS_STEPS = [
  {
    title: "Book Shipment",
    desc: "Tell us what you're sending and where it's going.",
  },
  {
    title: "Package Pickup",
    desc: "We collect from your location, on schedule.",
  },
  { title: "Transit", desc: "Your shipment moves by road, air or sea." },
  { title: "Tracking", desc: "Follow every checkpoint in real time." },
  { title: "Delivered", desc: "Signed, sealed, delivered — safely." },
];

export const ROUTES_MAP = [
  { name: "USA", top: "38%", left: "20%" },
  { name: "UK", top: "24%", left: "46%" },
  { name: "Canada", top: "26%", left: "18%" },
  { name: "Europe", top: "28%", left: "50%" },
  { name: "Middle East", top: "42%", left: "60%" },
];

export const TESTIMONIALS = [
  {
    quote: "Fastest logistics company I've used.",
    name: "Adaeze O.",
    role: "Lagos, Nigeria",
  },
  {
    quote: "My UK shipment arrived exactly on schedule.",
    name: "Michael T.",
    role: "London, UK",
  },
  {
    quote: "Affordable prices with excellent customer support.",
    name: "Chuka N.",
    role: "Abuja, Nigeria",
  },
];

export const ABOUT = {
  mission:
    "To move goods across Nigeria and around the world with speed, care and total transparency — so every customer knows exactly where their shipment is and when it will arrive.",
  vision:
    "To be Nigeria's most trusted logistics partner, connecting local businesses and individuals to global markets without the usual friction of international shipping.",
  values: [
    {
      title: "Reliability",
      desc: "We do what we say. Deadlines are commitments, not estimates.",
    },
    {
      title: "Speed",
      desc: "Every process is built to shave hours and days off transit time.",
    },
    {
      title: "Integrity",
      desc: "Transparent pricing and honest updates, even when a shipment is delayed.",
    },
    {
      title: "Customer-first",
      desc: "Support that actually picks up — on WhatsApp, on the phone, in person.",
    },
  ],
  story:
    "FSI Logistics started in Ogba, Lagos, with a simple frustration: shipping — locally or internationally — took too long and answered too few questions. What began as a small parcel counter has grown into a full logistics operation handling local delivery, express parcels, air and sea freight, and import/export for businesses and individuals across Nigeria.",
  timeline: [
    {
      year: "Year 1",
      title: "Founded in Ogba, Lagos",
      desc: "Started with local parcel delivery across Lagos.",
    },
    {
      year: "Year 3",
      title: "Nationwide coverage",
      desc: "Expanded delivery routes to cover all Nigerian states.",
    },
    {
      year: "Year 6",
      title: "International freight launched",
      desc: "Began air and sea freight to the USA, UK, Canada and Europe.",
    },
    {
      year: "Today",
      title: "Full-service logistics",
      desc: "Serving thousands of customers across 24+ countries.",
    },
  ],
};

export const CONTACT_SHIPMENT_TYPES = [
  "Local Delivery",
  "Express Parcel",
  "International Cargo",
  "Air Freight",
  "Sea Freight",
  "Import & Export",
  "Commercial Logistics",
  "Other",
];

export const FAQS = [
  {
    q: "Do you ship internationally?",
    a: "Yes. We ship to the USA, UK, Canada, Europe and several other international destinations by air and sea.",
  },
  {
    q: "How long does delivery take?",
    a: "Local deliveries typically arrive same-day to next-day. International shipments range from 3–14 days depending on the freight type and destination.",
  },
  {
    q: "Can I track my shipment?",
    a: "Yes, every shipment comes with a tracking number you can use on our Tracking page for live status updates.",
  },
  {
    q: "What items cannot be shipped?",
    a: "Restricted items include hazardous materials, illegal substances, and certain perishables. Contact us if you're unsure about a specific item.",
  },
  {
    q: "How are shipping costs calculated?",
    a: "Cost depends on weight, destination, and delivery type (express, standard, air or sea freight). Use our pricing estimator for an instant quote.",
  },
];
