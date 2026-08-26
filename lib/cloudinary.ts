import { auth } from "@/lib/firebase";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export async function uploadToCloudinary(
  file: File
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Please login before uploading images."
    );
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      "Only JPG, PNG, WebP and AVIF images are allowed."
    );
  }

  if (
    file.size <= 0 ||
    file.size > MAX_IMAGE_SIZE
  ) {
    throw new Error(
      "Image size must be between 1 byte and 10 MB."
    );
  }

  const idToken = await user.getIdToken();

  const data = new FormData();
  data.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: data,
  });

  const result = await res.json().catch(
    () => ({})
  );

  if (!res.ok || !result.secure_url) {
    throw new Error(
      result.error ||
        "Image upload failed. Please try again."
    );
  }

  return String(result.secure_url);
}
