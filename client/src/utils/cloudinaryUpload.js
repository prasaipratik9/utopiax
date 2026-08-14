export async function uploadToCloudinary(file, token) {
  const sigRes = await fetch("/api/uploads/signature", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const sig = await sigRes.json().catch(() => ({}));
  if (!sigRes.ok) {
    throw new Error(sig.error || "Could not get upload signature");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  body.append("timestamp", String(sig.timestamp));
  body.append("signature", sig.signature);
  body.append("folder", sig.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
    { method: "POST", body },
  );
  const data = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }
  return data.secure_url;
}
