"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"

interface MarkerItemProps {
  id: number
  address: string
  onDelete: (id: number) => void
  readOnly? : boolean
}

function MarkerItem({ id, address, onDelete, readOnly = false }: MarkerItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 ${!readOnly ? "p-1 mr-1" : "p-2 h-11 mr-1"} bg-card rounded-lg border ${isDragging ? "opacity-50" : ""}`}
    >
      {!readOnly && (
        <Button variant="secondary" type="button" className="touch-none bg-white" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-muted-foreground"/>
        </Button>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex-1 text-sm truncate">{`${address}` || "Загрузка адреса..."}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{`${address}`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!readOnly && (
        <button onClick={() => onDelete(id)} className="text-destructive hover:text-destructive/80 bg-white">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

interface MarkerListProps {
  markers: Array<{
    id: number
    address: string
  }>
  onDelete: (id: number) => void
  onReorder: (newOrder: number[]) => void
  readOnly?: boolean
}

export function MarkerList({ markers, onDelete, onReorder, readOnly = false }: MarkerListProps) {
  return (
    <div className={cn(
        "lg:w-96 sm:w-auto bg-background border-l flex flex-col h-full"
      )}
     >
      <div className="p-4 border-b">
        <h2 className="font-semibold">Маршрутные точки</h2>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto flex-1" style={{ minHeight: "200px", maxHeight: "calc(100vh - 200px)" }}>
        <SortableContext items={markers.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {markers.map((marker) => (
            <MarkerItem 
              key={marker.id} 
              id={marker.id} 
              address={marker.address} 
              onDelete={onDelete} 
              readOnly={readOnly} 
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}