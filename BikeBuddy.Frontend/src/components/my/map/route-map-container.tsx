"use client"

import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useState, useCallback, useRef, useImperativeHandle, forwardRef } from "react"
import { RouteMap, RouteMapRef } from "./map"
import { MarkerList } from "./marker-list"
import { Marker, Point } from "@/core/models/event/event-models"

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
  ) => void,
  readOnly?: boolean
}

export interface RouteMapContainerRef {
  exportMap: () => Promise<{
    blobImage: Blob | null
    markers: Array<Marker>
  }>,
  setPoints: (points: Point[]) => void
}

export const RouteMapContainer = forwardRef<RouteMapContainerRef, RouteMapContainerProps>(function RouteMapContainer( 
  { onRouteChange, onExport, readOnly = false }, ref) {
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
    setPoints: async (points: Point[]) => {
      if (points && points.length > 0) {
        const newMarkers = await Promise.all(
          points.map(async (point, index) => {
            const coord = [Number.parseFloat(point.lat), Number.parseFloat(point.lon)] as [number, number]
            const address = await mapRef.current?.getAddress(coord) || "";

            return {
              id: index + 1,
              address: address,
              coordinates: coord,
            } as Marker;
          })
        )

        handleMarkersUpdate(newMarkers)
      }
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
        <RouteMap ref={mapRef} onRouteChange={onRouteChange} markers={markers} onMarkersChange={setMarkers} readOnly={readOnly} />
      </div>
      {!readOnly ? (
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
      ) : (
        <MarkerList
          markers={markers}
          onDelete={handleMarkerDelete}
          onReorder={(newOrder) => {
            const newMarkers = newOrder.map((id) => markers.find((m) => m.id === id)!)
            handleMarkersUpdate(newMarkers)
          }}
          readOnly={readOnly}
        />
      )}
    </div>
  )
})

