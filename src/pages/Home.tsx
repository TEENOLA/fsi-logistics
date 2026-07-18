import Hero from "../components/home/Hero";
import WhyChooseUs from "../components/home/WhyChooseUs";
import ServicesPreview from "../components/home/ServicesPreview";
import ProcessTimeline from "../components/home/ProcessTimeline";
import GlobalReach from "../components/home/GlobalReach";
import Testimonials from "../components/home/Testimonials";
import Faq from "../components/home/Faq";
import CtaBanner from "../components/home/CtaBanner";
import Seo, { SITE_URL } from "../components/Seo";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "FSI Logistics",
  description:
    "Logistics company in Lagos, Nigeria offering local delivery, express parcel, air freight, sea freight, and import/export logistics services.",
  url: SITE_URL,
  telephone: "+234-905-058-8603",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop A114, Ogba Shopping Mall, beside Sunday Market",
    addressLocality: "Ogba, Lagos",
    addressCountry: "NG",
  },
  sameAs: ["https://instagram.com/fsi_logistics"],
};

export default function Home() {
  return (
    <>
      <Seo
        title="Logistics Company in Nigeria — Local & International Shipping"
        description="FSI Logistics offers fast, safe and reliable local delivery, express parcel, air freight, sea freight, and import/export logistics across Nigeria and 24+ countries."
        path="/"
        keywords={[
          "Logistics Company Nigeria",
          "International Shipping Nigeria",
          "Cargo Services Lagos",
          "Package Delivery Nigeria",
          "Courier Services Nigeria",
        ]}
        jsonLd={jsonLd}
      />
      <Hero />
      <WhyChooseUs />
      <ServicesPreview />
      <ProcessTimeline />
      <GlobalReach />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}
