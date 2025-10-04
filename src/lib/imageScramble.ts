// Image scrambling utilities for Hidey
export type ScrambleStyle = 'pixel-shuffle' | 'mosaic-blur' | 'glitch-lines';

// Shuffle array with seed for deterministic results
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = Math.floor((currentSeed / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// Generate seed from passphrase
function generateSeed(passphrase?: string): number {
  if (!passphrase) return 12345; // Default seed
  return passphrase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

// Load image from file
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

// Load image from base64
export function loadImageFromBase64(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image from base64'));
    
    img.src = base64;
  });
}

// Pixel Shuffle: Randomly rearrange small square blocks
function pixelShuffle(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, seed: number): void {
  const blockSize = 16;
  const width = canvas.width;
  const height = canvas.height;
  
  const blocksX = Math.ceil(width / blockSize);
  const blocksY = Math.ceil(height / blockSize);
  const totalBlocks = blocksX * blocksY;
  
  // Create array of block positions
  const positions: number[] = Array.from({ length: totalBlocks }, (_, i) => i);
  const shuffledPositions = shuffleWithSeed(positions, seed);
  
  // Create temporary canvas with original image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  
  // Rearrange blocks
  for (let i = 0; i < totalBlocks; i++) {
    const originalPos = i;
    const newPos = shuffledPositions[i];
    
    const origX = (originalPos % blocksX) * blockSize;
    const origY = Math.floor(originalPos / blocksX) * blockSize;
    
    const newX = (newPos % blocksX) * blockSize;
    const newY = Math.floor(newPos / blocksX) * blockSize;
    
    const imageData = tempCtx.getImageData(origX, origY, blockSize, blockSize);
    ctx.putImageData(imageData, newX, newY);
  }
}

// Mosaic Blur: Pixelated chunky blocks
function mosaicBlur(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, seed: number): void {
  const blockSize = 20;
  const width = canvas.width;
  const height = canvas.height;
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  
  // Apply mosaic effect with deterministic color shifts
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      const imageData = tempCtx.getImageData(x, y, 1, 1);
      const pixel = imageData.data;
      
      // Apply seed-based color shift
      const shift = ((seed + x * y) % 100) - 50;
      pixel[0] = Math.max(0, Math.min(255, pixel[0] + shift));
      pixel[1] = Math.max(0, Math.min(255, pixel[1] - shift));
      pixel[2] = Math.max(0, Math.min(255, pixel[2] + shift / 2));
      
      ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }
}

// Glitch Lines: Offset horizontal color stripes
function glitchLines(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, seed: number): void {
  const lineHeight = 4;
  const width = canvas.width;
  const height = canvas.height;
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  
  // Create glitch lines with deterministic offsets
  for (let y = 0; y < height; y += lineHeight) {
    const offset = ((seed + y * 13) % 100) - 50;
    const imageData = tempCtx.getImageData(0, y, width, lineHeight);
    
    // Apply RGB channel shifts
    for (let i = 0; i < imageData.data.length; i += 4) {
      const shift = ((seed + i) % 40) - 20;
      imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + shift)); // R
      imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] - shift)); // B
    }
    
    ctx.putImageData(imageData, offset, y);
  }
}

export interface ScrambleResult {
  base64: string;
  metadata: {
    style: ScrambleStyle;
    width: number;
    height: number;
    hasPassphrase: boolean;
  };
}

export interface DecodedScrambleData {
  image: string;
  style: ScrambleStyle;
  seed: string;
  params: {
    width: number;
    height: number;
  };
}

// Scramble an image
export async function scrambleImage(
  image: HTMLImageElement,
  style: ScrambleStyle,
  passphrase?: string
): Promise<ScrambleResult> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  // Draw original image
  ctx.drawImage(image, 0, 0);
  
  // Generate seed
  const seed = generateSeed(passphrase);
  
  // Apply scrambling based on style
  switch (style) {
    case 'pixel-shuffle':
      pixelShuffle(canvas, ctx, seed);
      break;
    case 'mosaic-blur':
      mosaicBlur(canvas, ctx, seed);
      break;
    case 'glitch-lines':
      glitchLines(canvas, ctx, seed);
      break;
  }
  
  // Convert to base64
  const base64 = canvas.toDataURL('image/png');
  
  return {
    base64,
    metadata: {
      style,
      width: image.width,
      height: image.height,
      hasPassphrase: !!passphrase,
    },
  };
}

// Unscramble an image (reverse the scrambling process)
export async function unscrambleImage(
  scrambledImage: HTMLImageElement,
  style: ScrambleStyle,
  passphrase?: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = scrambledImage.width;
  canvas.height = scrambledImage.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  // Draw scrambled image
  ctx.drawImage(scrambledImage, 0, 0);
  
  // Generate same seed
  const seed = generateSeed(passphrase);
  
  // Reverse the scrambling based on style
  switch (style) {
    case 'pixel-shuffle':
      reversePixelShuffle(canvas, ctx, seed);
      break;
    case 'mosaic-blur':
      // Mosaic blur can't be perfectly reversed, but we can remove the effect
      reverseMosaicBlur(canvas, ctx, seed);
      break;
    case 'glitch-lines':
      reverseGlitchLines(canvas, ctx, seed);
      break;
  }
  
  return canvas.toDataURL('image/png');
}

// Reverse pixel shuffle
function reversePixelShuffle(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, seed: number): void {
  const blockSize = 16;
  const width = canvas.width;
  const height = canvas.height;
  
  const blocksX = Math.ceil(width / blockSize);
  const blocksY = Math.ceil(height / blockSize);
  const totalBlocks = blocksX * blocksY;
  
  const positions: number[] = Array.from({ length: totalBlocks }, (_, i) => i);
  const shuffledPositions = shuffleWithSeed(positions, seed);
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  
  // Reverse the shuffle
  for (let i = 0; i < totalBlocks; i++) {
    const newPos = shuffledPositions[i];
    const origPos = i;
    
    const newX = (newPos % blocksX) * blockSize;
    const newY = Math.floor(newPos / blocksX) * blockSize;
    
    const origX = (origPos % blocksX) * blockSize;
    const origY = Math.floor(origPos / blocksX) * blockSize;
    
    const imageData = tempCtx.getImageData(newX, newY, blockSize, blockSize);
    ctx.putImageData(imageData, origX, origY);
  }
}

// Reverse mosaic blur (approximate)
function reverseMosaicBlur(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, seed: number): void {
  const blockSize = 20;
  const width = canvas.width;
  const height = canvas.height;
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  
  // Reverse the color shifts
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      const imageData = tempCtx.getImageData(x, y, blockSize, blockSize);
      const shift = ((seed + x * y) % 100) - 50;
      
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] - shift));
        imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + shift));
        imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] - shift / 2));
      }
      
      ctx.putImageData(imageData, x, y);
    }
  }
}

// Reverse glitch lines
function reverseGlitchLines(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, seed: number): void {
  const lineHeight = 4;
  const width = canvas.width;
  const height = canvas.height;
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, width, height);
  
  // Reverse the glitch offsets
  for (let y = 0; y < height; y += lineHeight) {
    const offset = ((seed + y * 13) % 100) - 50;
    const imageData = tempCtx.getImageData(offset, y, width, lineHeight);
    
    // Reverse RGB channel shifts
    for (let i = 0; i < imageData.data.length; i += 4) {
      const shift = ((seed + i) % 40) - 20;
      imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] - shift));
      imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + shift));
    }
    
    ctx.putImageData(imageData, 0, y);
  }
}

// Encode scrambled data with metadata
export function encodeScrambledData(result: ScrambleResult): string {
  const data = {
    style: result.metadata.style,
    seed: result.metadata.hasPassphrase ? "protected" : "default",
    params: {
      width: result.metadata.width,
      height: result.metadata.height,
    },
    image: result.base64,
  };
  return btoa(JSON.stringify(data));
}

// Decode scrambled data
export function decodeScrambledData(encoded: string): DecodedScrambleData {
  try {
    const decoded = JSON.parse(atob(encoded));
    return {
      image: decoded.image,
      style: decoded.style,
      seed: decoded.seed,
      params: {
        width: decoded.params.width,
        height: decoded.params.height,
      },
    };
  } catch (error) {
    throw new Error('Invalid scrambled image code');
  }
}
