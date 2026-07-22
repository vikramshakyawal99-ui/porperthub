export default function PropertySchema({ property }: any) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    image: property.images || [property.image],
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
