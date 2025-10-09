import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"
import React from "react"

interface ImageInputProps {
    index: number,
    hasImage: boolean,
    fileInputRefs : React.RefObject<(HTMLInputElement | null)[]>,
    imagePreviewUrls : string[],
    handleImageSelect : (index: number, event: React.ChangeEvent<HTMLInputElement>) => void,
    handleRemoveImage : (index: number) => void,
    handleImageClick : (index: number) => void
}

export default function ImageInput({index, hasImage, fileInputRefs, imagePreviewUrls, 
    handleImageSelect, 
    handleImageClick, 
    handleRemoveImage
}: ImageInputProps) {

    return (
      <div
          key={index}
          className={cn(
            "aspect-square rounded-lg border-2 relative overflow-hidden group",
            hasImage 
              ? "border-primary bg-primary/10"
              : "border-dashed border-muted-foreground hover:border-primary/50 cursor-pointer transition-colors",
          )}
          onClick={() => !hasImage && handleImageClick(index)}
          >
          <input
              ref={(el) => {
                if (fileInputRefs.current) {
                    (fileInputRefs.current[index] = el)
                }
              }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(index, e)}
          />

          {hasImage ? (
            <>
                <img
                    src={imagePreviewUrls[index] || "/placeholder.svg"}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveImage(index)
                      }}
                    >
                      Удалить
                    </Button>
                </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
      </div>
    )
}