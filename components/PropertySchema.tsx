export default function PropertySchema({ property }: any) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",

    name: property.title,

    description:
      property.description ||
      `Explore ${property.title} located in ${property.location}.`,

    image:
      property.images && property.images.length > 0
        ? property.images
        : property.image
        ? [property.image]
        : [],

    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "IN",
    },

    numberOfRooms: property.bedrooms
      ? `${property.bedrooms} Bedrooms`
      : undefined,

    floorSize: property.area
      ? {
          "@type": "QuantitativeValue",
          value: property.area,
        }
      : undefined,

    offers: {
      "@type": "Offer",
      price:
        typeof property.price === "string"
          ? property.price.replace(/[^\d]/g, "")
          : property.price,

      priceCurrency: "INR",

      availability:
        "https://schema.org/InStock",
    },

    brand: property.builder
      ? {
          "@type": "Organization",
          name: property.builder,
        }
      : undefined,

    url: `https://propertyhub.com/properties/${property.id}`,
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

