export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates a cropped image Blob from the original image source and the pixel crop area.
 * Returns both the Blob and an Object URL for preview.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  outputMimeType: "image/jpeg" | "image/png" = "image/jpeg",
  quality = 0.92
): Promise<{ blob: Blob; url: string }> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve({ blob, url: URL.createObjectURL(blob) });
      },
      outputMimeType,
      quality
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
