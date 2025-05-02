import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDataUrlToBlob(dataUrl: string) : Blob {
  const [mediaTypePart, base64Data] = dataUrl.split(',');

  const mediaType = mediaTypePart.match(/:(.*?);/)![1];

  const byteCharacters = atob(base64Data);
  const byteNumbers : number[] = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mediaType });
}

export function convertBlobToFormData(fileBlob: Blob, fileName: string) {
  var file = new File([fileBlob], fileName, {type : fileBlob.type })

  const formFile = new FormData();
  formFile.append("file", file)

  return formFile
}

export function convertFileToFormData(file: File) {
  const formFile = new FormData();
  formFile.append("file", file)

  return formFile
}
