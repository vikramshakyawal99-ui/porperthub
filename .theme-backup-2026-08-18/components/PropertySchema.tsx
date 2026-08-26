export default function PropertySchema({ property }: any) {
  const images =
    property.images && property.images.length > 0
      ? property.images
      : property.image
      ? [property.image]
      : [];

  const price =
    typeof property.price === "string"
      ? property.price.replace(/[^\d.]/g, "")
      : property.price;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",

    name: property.title || "Property in Jaipur",

    description:
      property.description ||
      `Explore ${property.title || "this property"} located in ${
        property.location || "Jaipur"
      }, Jaipur.`,

    image: images,

    url: `https://propertyhub.com/properties/${property.id}`,

    address: {
      "@type": "PostalAddress",
      addressLocality: property.location || "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },

    ...(property.bedrooms
      ? {
          numberOfRooms: Number(property.bedrooms) || undefined,
        }
      : {}),

    ...(property.area
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value:
              typeof property.area === "string"
                ? Number(property.area.replace(/[^\d.]/g, "")) || undefined
                : property.area,
            unitText: "sq ft",
          },
        }
      : {}),

    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `https://propertyhub.com/properties/${property.id}`,
          },
        }
      : {}),

    ...(property.builder
      ? {
          brand: {
            "@type": "Organization",
            name: property.builder,
          },
        }
      : {}),
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
