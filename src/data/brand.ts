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

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "International", to: "/international" },
  { label: "Pricing", to: "/pricing" },
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
      "We move cargo between Nigeria and the USA, UK, Canada, Europe and other international destinations, with full customs support and door-to-door options.",
    countries: ["USA", "UK", "Canada", "Europe", "Rest of World"],
  },
  {
    slug: "local-delivery",
    title: "Local Delivery",
    short: "Fast nationwide delivery across Nigeria.",
    detail:
      "From Lagos to every state in Nigeria, our local network gets packages moving the same day they're booked.",
  },
  {
    slug: "express-parcel",
    title: "Express Parcel Delivery",
    short: "Same-day and next-day delivery where available.",
    detail:
      "For time-critical shipments, our express lane prioritises pickup, handling and delivery ahead of standard freight.",
  },
  {
    slug: "air-freight",
    title: "Air Freight",
    short: "Fast international shipment.",
    detail:
      "Air cargo partnerships across major hubs mean your shipment clears and moves in days, not weeks.",
  },
  {
    slug: "sea-freight",
    title: "Sea Freight",
    short: "Affordable shipping for bulk cargo.",
    detail:
      "For large or heavy shipments, ocean freight offers the most cost-effective route between continents.",
  },
  {
    slug: "import-export",
    title: "Import & Export",
    short: "International import/export logistics.",
    detail:
      "End-to-end support for businesses moving goods in and out of Nigeria, including documentation and clearance.",
  },
  {
    slug: "commercial-logistics",
    title: "Commercial Logistics",
    short: "Supply chain solutions for businesses.",
    detail:
      "Scheduled freight, warehousing coordination and bulk shipment management for growing companies.",
  },
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
