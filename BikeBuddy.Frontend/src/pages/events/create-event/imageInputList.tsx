import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import ImageInput from "./imageInput"
import { toastAlert } from "@/core/helpers"
import { isSupportedImageFormat } from "@/lib/fileHelpers"

interface ImageInputListProps {
    count : number
}

export interface ImageInputListRef {
    getFiles: () => File[];
}

export const ImageInputList = forwardRef<ImageInputListRef, ImageInputListProps>((props, ref) =>
{
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

    useImperativeHandle(ref, () => ({
        getFiles: () => uploadedImages
    }));

    useEffect(() => {
        return () => {
            imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [])

    const handleImageSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) {
            toastAlert('Файл не выбран', '', 'error', 'bottom-right')
            return
        }

        if (!isSupportedImageFormat(file.name)) {
            toastAlert('Выберите файл изображения', '', 'error', 'bottom-right')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toastAlert('Размер изображения не должен превышать 5 МБ', '', 'error', 'bottom-right')
            return
        }

        const previewUrl = URL.createObjectURL(file)

        const newImages = [...uploadedImages]
        const newPreviews = [...imagePreviewUrls]
        
        if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index])
        }

        newImages[index] = file
        newPreviews[index] = previewUrl

        setUploadedImages(newImages)
        setImagePreviewUrls(newPreviews)
    }

    const handleRemoveImage = (index: number) => {
        const newImages = [...uploadedImages]
        const newPreviews = [...imagePreviewUrls]

        if (newPreviews[index]) {
            URL.revokeObjectURL(newPreviews[index])
        }

        newImages.splice(index, 1)
        newPreviews.splice(index, 1)

        setUploadedImages(newImages)
        setImagePreviewUrls(newPreviews)

        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]!.value = ""
        }
    }

    const handleImageClick = (index: number) => {
        fileInputRefs.current[index]?.click()
    }

    return (
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Дополнительные фотографии
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(props.count)].map((_, index) => {
                
                    return (
                        <ImageInput
                            index={index}
                            hasImage={imagePreviewUrls[index] != null}
                            fileInputRefs={fileInputRefs}
                            imagePreviewUrls={imagePreviewUrls}
                            handleImageSelect={handleImageSelect}
                            handleRemoveImage={handleRemoveImage}
                            handleImageClick={handleImageClick}
                        />
                    )
                })}
          </div>
          <p className="text-sm text-muted-foreground">
            {`Максимум ${props.count} изображений`}
          </p>
        </div>
    )
})
