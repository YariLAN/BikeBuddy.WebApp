
export const IMAGE_FORMATS : Set<string> = new Set([
    'jpg', 
    'jpeg',
    'png',
    'bmp',
    'tiff', 
    'tif',
    'webp',
    'svg',
    'ico'
])

export function isSupportedImageFormat(filename: string): boolean {
  const extension = filename.toLowerCase().split('.').pop() || '';
  
  return IMAGE_FORMATS.has(extension);
}