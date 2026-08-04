export function optimizeImage(url?: string) {

  if (!url) return "/placeholder.jpg";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_900,c_limit/"
  );

}
