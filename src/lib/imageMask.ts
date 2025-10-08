import CryptoJS from "crypto-js";
import pako from "pako";

export type MaskType = "blur" | "swirl" | "pixel" | "noise" | "mosaic";

export interface MaskResult {
  maskedPreview: string;
  encodedData: string;
  metadata: {
    maskType: MaskType;
    hasPassphrase: boolean;
  };
}

// Load image from file
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Load image from base64
export function loadImageFromBase64(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
  });
}

// Convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Apply blur mask
function applyBlurMask(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
): void {
  ctx.filter = "blur(15px)";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.filter = "none";
}

// Apply pixelation mask
function applyPixelMask(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
): void {
  const pixelSize = 15;
  const w = canvas.width;
  const h = canvas.height;

  ctx.drawImage(img, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y += pixelSize) {
    for (let x = 0; x < w; x += pixelSize) {
      const pixelIndex = (y * w + x) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      for (let dy = 0; dy < pixelSize && y + dy < h; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < w; dx++) {
          const index = ((y + dy) * w + (x + dx)) * 4;
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Apply noise mask
function applyNoiseMask(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
): void {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 150 - 75;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

// Apply mosaic mask
function applyMosaicMask(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
): void {
  const blockSize = 20;
  const w = canvas.width;
  const h = canvas.height;

  ctx.drawImage(img, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y += blockSize) {
    for (let x = 0; x < w; x += blockSize) {
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let dy = 0; dy < blockSize && y + dy < h; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < w; dx++) {
          const index = ((y + dy) * w + (x + dx)) * 4;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          count++;
        }
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      for (let dy = 0; dy < blockSize && y + dy < h; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < w; dx++) {
          const index = ((y + dy) * w + (x + dx)) * 4;
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Apply swirl mask
function applySwirlMask(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
): void {
  const w = canvas.width;
  const h = canvas.height;
  const centerX = w / 2;
  const centerY = h / 2;
  const radius = Math.min(w, h) / 2;
  const angle = 2;

  ctx.drawImage(img, 0, 0, w, h);
  const original = ctx.getImageData(0, 0, w, h);
  const result = ctx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const percent = (radius - distance) / radius;
        const theta = percent * percent * angle;

        const srcX = Math.round(
          centerX + dx * Math.cos(theta) - dy * Math.sin(theta)
        );
        const srcY = Math.round(
          centerY + dx * Math.sin(theta) + dy * Math.cos(theta)
        );

        if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
          const srcIndex = (srcY * w + srcX) * 4;
          const destIndex = (y * w + x) * 4;

          result.data[destIndex] = original.data[srcIndex];
          result.data[destIndex + 1] = original.data[srcIndex + 1];
          result.data[destIndex + 2] = original.data[srcIndex + 2];
          result.data[destIndex + 3] = original.data[srcIndex + 3];
          continue;
        }
      }

      const srcIndex = (y * w + x) * 4;
      result.data[srcIndex] = original.data[srcIndex];
      result.data[srcIndex + 1] = original.data[srcIndex + 1];
      result.data[srcIndex + 2] = original.data[srcIndex + 2];
      result.data[srcIndex + 3] = original.data[srcIndex + 3];
    }
  }

  ctx.putImageData(result, 0, 0);
}

// Apply mask based on type
async function applyMask(
  imageFile: File,
  maskType: MaskType
): Promise<string> {
  const img = await loadImageFromFile(imageFile);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  canvas.width = img.width;
  canvas.height = img.height;

  switch (maskType) {
    case "blur":
      applyBlurMask(canvas, ctx, img);
      break;
    case "pixel":
      applyPixelMask(canvas, ctx, img);
      break;
    case "noise":
      applyNoiseMask(canvas, ctx, img);
      break;
    case "mosaic":
      applyMosaicMask(canvas, ctx, img);
      break;
    case "swirl":
      applySwirlMask(canvas, ctx, img);
      break;
  }

  return canvas.toDataURL("image/png");
}

// Derive encryption key from passphrase using SHA-256
async function deriveKey(passphrase: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(passphrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Main mask function
export async function maskImage(
  imageFile: File,
  maskType: MaskType,
  passphrase: string
): Promise<MaskResult> {
  if (!passphrase) {
    throw new Error("Passphrase is required");
  }

  // Convert image to base64
  const base64 = await fileToBase64(imageFile);

  // Derive encryption key from passphrase
  const key = await deriveKey(passphrase);

  // Encrypt the original image with derived key
  const encrypted = CryptoJS.AES.encrypt(base64, key).toString();

  // Compress the encrypted data
  function uint8ToBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000; // 32KB chunks to avoid call stack overflow
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...Array.from(chunk));
    }
    return btoa(binary);
  }
  const compressed = pako.deflate(encrypted);
  const compressedBase64 = uint8ToBase64(compressed);
  
  // Create masked preview (always blur for visual effect)
  const maskedPreview = await applyMask(imageFile, "blur");

  return {
    maskedPreview,
    encodedData: compressedBase64,
    metadata: {
      maskType,
      hasPassphrase: true,
    },
  };
}

// Reveal original image
export async function revealImage(
  encodedData: string,
  passphrase: string
): Promise<string | null> {
  try {
    // Decompress the data
    const compressedData = Uint8Array.from(atob(encodedData), (c) =>
      c.charCodeAt(0)
    );
    const decompressed = pako.inflate(compressedData, { to: "string" });

    // Derive the same encryption key
    const key = await deriveKey(passphrase);

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(decompressed, key);
    const base64 = bytes.toString(CryptoJS.enc.Utf8);

    if (!base64) {
      throw new Error("Decryption failed");
    }

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Reveal error:", error);
    return null;
  }
}

// Generate portable short code that contains all data
export function generateShortCode(result: MaskResult): string {
  const payload = {
    encrypted: result.encodedData,
    mask: result.metadata.maskType,
  };
  const jsonStr = JSON.stringify(payload);
  const compressed = pako.deflate(jsonStr);
  const base64 = uint8ToBase64(compressed);
  // Use base64url encoding (replace +/ with -_ and remove padding)
  const shortCode = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `HIDEY-${shortCode}`;
}

// Helper for compression
function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...Array.from(chunk));
  }
  return btoa(binary);
}

// Decode short code to get encrypted data
export function decodeShortCode(shortCode: string): {
  encrypted: string;
  maskType: MaskType;
} {
  try {
    // Remove HIDEY- prefix
    if (!shortCode.startsWith("HIDEY-")) {
      throw new Error("Invalid code format");
    }
    
    const encoded = shortCode.substring(6);
    // Convert back from base64url to base64
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padded = base64 + '=='.substring(0, (4 - base64.length % 4) % 4);
    
    // Decompress
    const compressedData = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    const decompressed = pako.inflate(compressedData, { to: 'string' });
    const payload = JSON.parse(decompressed);

    return {
      encrypted: payload.encrypted,
      maskType: payload.mask,
    };
  } catch (error) {
    console.error("Decode error:", error);
    throw new Error("Invalid or corrupted code");
  }
}
