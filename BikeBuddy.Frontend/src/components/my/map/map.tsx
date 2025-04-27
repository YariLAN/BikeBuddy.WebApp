"use client"

import "ol/ol.css"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Map } from "ol"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import XYZ from "ol/source/XYZ"
import { fromLonLat, transform } from "ol/proj"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Feature } from "ol"
import { LineString, Point } from "ol/geom"
import { Style, Stroke, Icon } from "ol/style"
import { Select } from "ol/interaction"
import Modify from "ol/interaction/Modify"
import { click } from "ol/events/condition"
import { CoordinatesDisplay } from "./coordinates-display"
import { Marker } from "@/core/models/event/event-models"
import { convertDataUrlToBlob } from "@/lib/utils"


export interface RouteMapRef {
  exportMap: () => Promise<{
    blobImage: Blob | null
    markers: Array<Marker>
  }>,
  getAddress: (coordinates: [number, number]) => Promise<string>
}

interface RouteMapProps {
  markers: Array<Marker>
  onMarkersChange: (
    markers: Array<Marker>,
  ) => void
  onRouteChange?: (route: {
    startAddress: string
    endAddress: string
    distance: number
    duration: number
  }) => void
  readOnly?: boolean
}

let nextId = 1

export const RouteMap = forwardRef<RouteMapRef, RouteMapProps>(function RouteMap(
  { markers, onMarkersChange, onRouteChange, readOnly = false  }, ref) 
{
  const apiKey = import.meta.env.VITE_NEXT_PUBLIC_GEOAPIFY_API_KEY

  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [mouseCoordinates, setMouseCoordinates] = useState<[number, number] | null>(null)
  
  const [isMapReady, setIsMapReady] = useState(false);
  const [idMarker, setIdMarker] = useState<number | null>(null)

  const isUpdating = useRef(false);

  const [routeLayer] = useState(
    new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 3,
        }),
      }),
    }),
  )

  const getMarkerStyle = (index: number, total: number) => {
    if (index === 0) {
      // Start marker
      return new Style({
        image: new Icon({
          src: "/start-marker.svg",
          width: 35,
          height: 45,
          anchor: [0.5, 1],
        }),
        zIndex: 13,
      })
    } else if (index === total - 1 && total > 1) {
      // End marker
      return new Style({
        image: new Icon({
          src: "/end-marker.svg",
          width: 35,
          height: 45,
          anchor: [0.5, 1],
        }),
        zIndex: 13,
      })
    } else {
      // Intermediate markers
      return new Style({
        image: new Icon({
          src: "/marker.svg",
          width: 35,
          height: 45,
          anchor: [0.5, 1],
        }),
        zIndex: 12,
      })
    }
  }

  const [markersLayer] = useState(
    new VectorLayer({
      source: new VectorSource(),
      style: (feature) => {
        const id = feature.get("id")
        const index = markers.findIndex((m) => m.id === id)
        return getMarkerStyle(index, markers.length)
      },
    }),
  )

  // Обновляем маркеры на карте при изменении их в состоянии
  useEffect(() => {
    if (!map) return

    const modify = new Modify({ source: markersLayer.getSource()! })

    if (!readOnly) {
      map.addInteraction(modify)
    }

    const updatePointerFunc = async (event: any) => {
      if (isUpdating.current) return;
      isUpdating.current = true;
  
      try {
        const feature = event.features.getArray()[0];
        const geometry = feature.getGeometry() as Point;
        const coordinates = transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:4326") as [number, number];
  
        // Обновление адреса
        const address = await getAddress(coordinates);
  
        const id = feature.get("id");
        const markerIndex = markers.findIndex((m) => m.id === id);
  
        if (markerIndex !== -1) {
          const newMarkers = [...markers];
          newMarkers[markerIndex] = {
            ...newMarkers[markerIndex],
            address,
            coordinates,
          };
          onMarkersChange(newMarkers);

          setIdMarker(markerIndex)
        }
      } catch (error) {
        console.error("Ошибка при обновлении маркера:", error);
      } finally {
        isUpdating.current = false;
      }
    };

    // Обработчик для обновления маршрута при изменении позиции метки
    modify.on("modifyend", updatePointerFunc)

    markersLayer.getSource()?.clear()

    markers.forEach((marker) => {
      const coordinates = fromLonLat(marker.coordinates)
      const feature = new Feature({
        geometry: new Point(coordinates),
        id: marker.id,
      })
      markersLayer.getSource()?.addFeature(feature)
      
      setIdMarker(null)
    })

    const calculateRouteAsync = async () => {
      if (markers.length >= 2) {
        try {
          await calculateRoute(markers.map((m) => m.coordinates));
        } catch (error) {
          console.error("Ошибка при расчете маршрута:", error);
        }
      } else {
        routeLayer.getSource()?.clear();
      }
    };
  
    calculateRouteAsync();
    
    return () => {
      if (!readOnly) {
        map.removeInteraction(modify)
      }
    };
  }, [markers, map, markersLayer])

  // Вычисление центра карты на основе крайних точек маршрута
  // Если маркеров нет - по умолчанию центр - Санкт-Петербург
  const calculateCenter = (markers: Marker[] | null) : { center: [number, number], zoom: number } => {
    if (!markers || markers.length == 0) {
      return { center: [30.3141, 59.9386], zoom: 11 }
    }

    const lons = markers.map(m => m.coordinates[0])
    const lats = markers.map(m => m.coordinates[1])

    const [minLon, maxLon] = [Math.min(...lons), Math.max(...lons)];
    const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];

    const center: [number, number] = [ (minLon + maxLon) / 2, (minLat + maxLat) / 2];
    
    const [lonDiff, latDiff] = [maxLon - minLon, maxLat - minLat];
    const maxDiff = Math.max(lonDiff, latDiff);
    const zoom = 12 - Math.log2(maxDiff * 10);

    return {center, zoom};
  }

  // Инициализация карты
  useEffect(() => {
    if (!mapRef.current) return;
  
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${apiKey}`,
            crossOrigin: 'anonymous',
          }),
        }),
        routeLayer,
        markersLayer,
      ],
      view: new View({
        center: fromLonLat([30.3141, 59.9386]),
        zoom: 11,
      }),
    });

    setMap(map)

    return () => map.dispose();
  }, []); 

  // Обновление центра при изменении маркеров
  useEffect(() => {
    if (!map || !markers?.length) return;

    if (isMapReady || markers.length == 1) {
      const point = markers[idMarker != null ? idMarker : markers.length - 1].coordinates
      map.getView().animate({
        center: fromLonLat(point),
        duration: 200,
      });
      
      setIsMapReady(true)
    } else {
      const settingMap = calculateCenter(markers);
      let mapView = map.getView()

      mapView.setCenter(fromLonLat(settingMap.center));
      mapView.setZoom(settingMap.zoom)

      setIsMapReady(true)
    }
  }, [markers]);

  useEffect(() => {
    if (!mapRef.current || !map) return

    const initialMap = map

    if (!readOnly) {
      const select = new Select({
        layers: [markersLayer],
        condition: click,
      })
      initialMap.addInteraction(select)
    }

    // Обработчик для отслеживания движения мыши
    const handlePointerMove = (event: any) => {
      const coordinates = transform(initialMap.getCoordinateFromPixel(event.pixel), "EPSG:3857", "EPSG:4326") as [
        number,
        number,
      ]
      setMouseCoordinates(coordinates)
    }

    // Обработчик для очистки координат при уходе мыши с карты
    const handlePointerLeave = () => {
      setMouseCoordinates(null)
    }
    
    initialMap.on("pointermove", handlePointerMove)
    mapRef.current.addEventListener("mouseleave", handlePointerLeave)
    
    return () => {
      initialMap.dispose()
      if (mapRef.current) {
        mapRef.current.removeEventListener("mouseleave", handlePointerLeave)
      }
    }
  }, [map])

  const calculateRoute = async (points: [number, number][]) => {
    try {
      const waypoints = points.map((point) => `${point[1]},${point[0]}`).join("|")
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=bicycle&type=short&lang=ru&apiKey=${apiKey}`,
      )

      if (!response.ok) throw new Error("Failed to calculate route")

      const data = await response.json()

      routeLayer.getSource()?.clear()

      const coordinates = data.features[0].geometry.coordinates.map((x: any) =>
        x.map((coord: [number, number]) => fromLonLat(coord)),
      )

      coordinates.forEach((coordArr: any) => {
        const routeFeature = new Feature({
          geometry: new LineString(coordArr),
        })
        routeLayer.getSource()?.addFeature(routeFeature)
      })

      if (onRouteChange) {
        onRouteChange({
          startAddress: markers[0].address,
          endAddress: markers[markers.length - 1].address,
          distance: data.features[0].properties.distance / 1000,
          duration: data.features[0].properties.time / 60,
        })
      }
    } catch (error) {
      console.error("Error calculating route:", error)
    }
  }

  const getAddress = async ([lon, lat]: [number, number]): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=ru&apiKey=${apiKey}`,
      )

      if (!response.ok) throw new Error("Failed to get address")

      const data = await response.json()
      return data.features[0].properties.formatted
    } catch (error) {
      console.error("Error getting address:", error)
      return ""
    }
  }

  useEffect(() => {
    if (!map || readOnly) return

    const handleClick = async (event: any) => {
      const clickedCoord = map.getCoordinateFromPixel(event.pixel)
      const lonLat = transform(clickedCoord, "EPSG:3857", "EPSG:4326") as [number, number]

      const address = await getAddress(lonLat)
      const newMarker = {
        id: nextId++,
        address,
        coordinates: lonLat,
      }

      onMarkersChange([...markers, newMarker])
    }

    map.on("click", handleClick)

    return () => {
      map.un("click", handleClick)
    }
  }, [map, markers, onMarkersChange, getAddress])

  const exportMap = () => {
    if (!map) return { imageData: null, markers }

    return new Promise((resolve) => {
      map.once("rendercomplete", () => {
        const canvas = document.createElement("canvas")
        const size = map.getSize()
        if (!size) return resolve({ imageData: null, markers })

        canvas.width = size[0]
        canvas.height = size[1]

        const mapCanvas = map.getViewport().querySelector("canvas")
        if (!mapCanvas) return resolve({ imageData: null, markers })

        const context = canvas.getContext("2d")
        if (!context) return resolve({ imageData: null, markers })

        context.drawImage(mapCanvas, 0, 0)

        // base64 image
        const imageData = canvas.toDataURL("image/png")
        const blobImage = convertDataUrlToBlob(imageData)

        resolve({
          blobImage,
          markers,
        })
      })

      // Trigger a map render
      map.renderSync()
    })
  }

  useImperativeHandle(ref, () => ({
    exportMap,
    getAddress,
  }))

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[700px] sm:min-h-[600px] rounded-lg overflow-hidden relative"
      style={{ aspectRatio: "16/9" }}
    >
      <CoordinatesDisplay coordinates={mouseCoordinates} />
    </div>
  )
})