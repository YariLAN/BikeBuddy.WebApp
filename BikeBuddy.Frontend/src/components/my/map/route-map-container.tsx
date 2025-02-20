"use client"

import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useState, useCallback } from "react"
import { RouteMap } from "./map"
import { MarkerList } from "./marker-list"

interface RouteMapContainerProps {
  onRouteChange?: (route: {
    startAddress: string
    endAddress: string
    distance: number
    duration: number
  }) => void
}

export function RouteMapContainer({ onRouteChange }: RouteMapContainerProps) {
  const [markers, setMarkers] = useState<
    Array<{
      id: number
      address: string
      coordinates: [number, number]
    }>
  >([])

  const handleMarkersUpdate = useCallback(
    (newMarkers: typeof markers) => {
      setMarkers(newMarkers)
      if (newMarkers.length >= 2) {
        const [first, last] = [newMarkers[0], newMarkers[newMarkers.length - 1]]
        onRouteChange?.({
          startAddress: first.address,
          endAddress: last.address,
          distance: 0, // Это будет обновлено через RouteMap
          duration: 0, // Это будет обновлено через RouteMap
        })
      }
    },
    [onRouteChange],
  )

  const handleMarkerDelete = (id: number) => {
    const newMarkers = markers.filter((m) => m.id !== id)
    handleMarkersUpdate(newMarkers)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = markers.findIndex((m) => m.id === active.id)
    const newIndex = markers.findIndex((m) => m.id === over.id)

    const newMarkers = arrayMove(markers, oldIndex, newIndex)
    handleMarkersUpdate(newMarkers)
  }

  return (
    <div className="flex lg:h-[630px] sm:h-full lg:flex-row sm:flex-col">
      <div className="flex-1">
        <RouteMap onRouteChange={onRouteChange} markers={markers} onMarkersChange={setMarkers} />
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <MarkerList
          markers={markers}
          onDelete={handleMarkerDelete}
          onReorder={(newOrder) => {
            const newMarkers = newOrder.map((id) => markers.find((m) => m.id === id)!)
            handleMarkersUpdate(newMarkers)
          }}
        />
      </DndContext>
    </div>
  )
}

