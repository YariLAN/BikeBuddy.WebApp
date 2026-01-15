import { ImageInputMode } from "../ImageInput/type";

export interface ImageInputListProps {
    count : number,
    mode : ImageInputMode
}

export interface ImageInputListRef {
    getFiles: () => File[];
    setUrls: (urls: string[]) => void;
}