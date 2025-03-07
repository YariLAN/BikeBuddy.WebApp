"use client"

import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useState, useCallback, useRef, useImperativeHandle, forwardRef } from "react"
import { RouteMap, RouteMapRef } from "./map"
import { MarkerList } from "./marker-list"
import { Marker } from "@/core/models/event-models"

interface RouteMapContainerProps {
  onRouteChange?: (route: {
    startAddress: string
    endAddress: string
    distance: number
    duration: number
  }) => void
  onExport?: (
    imageData: string,
    markers: Array<Marker>,
  ) => void
}

export interface RouteMapContainerRef {
  exportMap: () => Promise<{
    blobImage: Blob | null
    markers: Array<Marker>
  }>
}

export const RouteMapContainer = forwardRef<RouteMapContainerRef, RouteMapContainerProps>(function RouteMapContainer( { onRouteChange, onExport }, ref) {
  const mapRef = useRef<RouteMapRef>(null)
  const [markers, setMarkers] = useState<
    Array<{
      id: number
      address: string
      coordinates: [number, number]
    }>
  >([])

  // Forward the exportMap method through useImperativeHandle
  useImperativeHandle(ref, () => ({
    exportMap: async () => {
      const result = await mapRef.current?.exportMap()
      return result || { blobImage: null, markers: [] }
    },
  }))

  const handleMarkersUpdate = useCallback(
    (newMarkers: typeof markers) => {
      setMarkers(newMarkers)
      if (newMarkers.length >= 2) {
        const [first, last] = [newMarkers[0], newMarkers[newMarkers.length - 1]]
        onRouteChange?.({
          startAddress: first.address,
          endAddress: last.address,
          distance: 0,
          duration: 0,
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
        <RouteMap ref={mapRef} onRouteChange={onRouteChange} markers={markers} onMarkersChange={setMarkers} />
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
})

