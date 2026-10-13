import crypto from "node:crypto";
import { env } from "../../config/env.js";
import { AppError } from "../../lib/errors.js";

/**
 * Uploads a base64 or buffer image directly to Cloudinary using their REST API.
 * Uses native fetch and crypto without external dependencies.
 */
export async function uploadAvatarToCloudinary(fileDataUri) {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new AppError("Cloudinary is not configured on the server", 500, "CLOUDINARY_NOT_CONFIGURED");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "saathhisab_avatars";
  
  // Params to sign must be sorted alphabetically: folder, timestamp
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const formData = new FormData();
  formData.append("file", fileDataUri);
  formData.append("api_key", env.CLOUDINARY_API_KEY);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("signature", signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    const message = result.error?.message || "Failed to upload image to Cloudinary";
    throw new AppError(message, 502, "IMAGE_UPLOAD_FAILED");
  }

  return result.secure_url;
}
