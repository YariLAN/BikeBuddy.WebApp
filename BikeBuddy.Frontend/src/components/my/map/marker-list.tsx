"use client"

import { Button } from "@/components/ui/button"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"

interface MarkerItemProps {
  id: number
  address: string
  onDelete: (id: number) => void
}

function MarkerItem({ id, address, onDelete }: MarkerItemProps) {
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
      className={`flex items-center gap-2 p-1 bg-card rounded-lg border ${isDragging ? "opacity-50" : ""}`}
    >
      <Button variant="secondary" type="button" className="touch-none bg-white" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-muted-foreground"/>
      </Button>
      <span className="flex-1 text-sm truncate">{address || "Загрузка адреса..."}</span>
      <button onClick={() => onDelete(id)} className="text-destructive hover:text-destructive/80 bg-white">
        <X className="h-5 w-5" />
      </button>
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
}

export function MarkerList({ markers, onDelete, onReorder }: MarkerListProps) {
  return (
    <div className="lg:w-96 sm:w-auto bg-background border-l flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Маршрутные точки</h2>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto flex-1" style={{ minHeight: "200px", maxHeight: "calc(100vh - 200px)" }}>
        <SortableContext items={markers.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {markers.map((marker) => (
            <MarkerItem key={marker.id} id={marker.id} address={marker.address} onDelete={onDelete} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}