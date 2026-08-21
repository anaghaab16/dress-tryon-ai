/**
 * Reads a File and returns a downscaled JPEG data URL.
 * Keeps uploads small enough to send to the model and store in the database.
 */
export async function fileToCompressedDataUrl(file: File, maxSide = 1280): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.92);
}
/**
 * Fetches an image URL (e.g. a bundled catalogue photo) and returns it as a
 * downscaled JPEG data URL so it can be sent to the try-on model.
 */
export async function urlToCompressedDataUrl(url: string, maxSide = 1280): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], "garment.jpg", { type: blob.type || "image/jpeg" });
  return fileToCompressedDataUrl(file, maxSide);
}
