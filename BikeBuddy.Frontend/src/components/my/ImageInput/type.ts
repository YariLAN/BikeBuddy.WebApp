export interface ImageInputProps {
    mode? : ImageInputMode,
    index: number,
    hasImage: boolean,
    fileInputRefs : React.RefObject<(HTMLInputElement | null)[]>,
    imagePreviewUrls : string[],
    handleImageSelect : (index: number, event: React.ChangeEvent<HTMLInputElement>) => void,
    handleRemoveImage : (index: number) => void,
    handleImageClick : (index: number) => void
}

export enum ImageInputMode {
    View,
    Edit
}