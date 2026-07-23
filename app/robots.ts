import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin-login/",
        "/login/",
        "/signup/",
        "/forgot-password/",
        "/wishlist/",
        "/favorites/",
        "/compare/",
      ],
    },

    sitemap: "https://propertyhub.com/sitemap.xml",
  };
}
