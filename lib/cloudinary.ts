export async function uploadToCloudinary(file: File) {
  const data = new FormData();

  data.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: data,
  });

  const result = await res.json();

  if (!result.secure_url) {
    throw new Error(result.error || "Cloudinary upload failed");
  }

  return result.secure_url;
}
