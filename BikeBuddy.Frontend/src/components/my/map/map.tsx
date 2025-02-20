// "use client"

// import "ol/ol.css"

// import { useEffect, useRef, useState } from "react"
// import { Map } from "ol"
// import View from "ol/View"
// import TileLayer from "ol/layer/Tile"
// import XYZ from "ol/source/XYZ"
// import { fromLonLat, transform } from "ol/proj"
// import VectorLayer from "ol/layer/Vector"
// import VectorSource from "ol/source/Vector"
// import { Feature } from "ol"
// import { LineString, Point } from "ol/geom"
// import { Style, Stroke, Icon } from "ol/style"
// import Modify from "ol/interaction/Modify"
// import { Select } from "ol/interaction"
// import { click } from "ol/events/condition"
// import { CoordinatesDisplay } from "./coordinates-display"

// interface RouteMapProps {
//   onRouteChange?: (route: {
//     startAddress: string
//     endAddress: string
//     distance: number
//     duration: number
//   }) => void
// }

// let index: number = 1
// export function RouteMap({ onRouteChange }: RouteMapProps) {
//   const mapRef = useRef<HTMLDivElement>(null)
//   const [map, setMap] = useState<Map | null>(null)
//   const [mouseCoordinates, setMouseCoordinates] = useState<[number, number] | null>(null)
//   const apiKey = import.meta.env.VITE_NEXT_PUBLIC_GEOAPIFY_API_KEY

//   const [routeLayer] = useState(
//     new VectorLayer({
//       source: new VectorSource(),
//       style: new Style({
//         stroke: new Stroke({
//           color: "blue",
//           width: 3,
//         }),
//       }),
//     }),
//   )
//   const [markersLayer] = useState(
//     new VectorLayer({
//       source: new VectorSource(),
//       style: new Style({
//         image: new Icon({
//           src: "/marker.svg",
//           width: 35,
//           height: 45,
//           anchor: [0.5, 1],
//         }),
//         zIndex: 12,
//       }),
//     }),
//   )

//   const [points, setPoints] = useState<[number, number][]>([])

//   useEffect(() => {
//     if (!mapRef.current) return

//     const initialMap = new Map({
//       target: mapRef.current,
//       layers: [
//         new TileLayer({
//           source: new XYZ({
//             url: `https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${apiKey}`,
//           }),
//         }),
//         routeLayer,
//         markersLayer,
//       ],
//       view: new View({
//         center: fromLonLat([30.3141, 59.9386]), // Спб
//         zoom: 11,
//       }),
//     })

//     setMap(initialMap)

//     // Добавляем взаимодействие для изменения позиции меток
//     const modify = new Modify({ source: markersLayer.getSource()! })
//     initialMap.addInteraction(modify)

//     // Добавляем взаимодействие для выбора меток (для удаления)
//     const select = new Select({
//       layers: [markersLayer],
//       condition: click,
//     })
//     initialMap.addInteraction(select)

//     // Обработчик для отслеживания движения мыши
//     const handlePointerMove = (event: any) => {
//       const coordinates = transform(initialMap.getCoordinateFromPixel(event.pixel), "EPSG:3857", "EPSG:4326") as [
//         number,
//         number,
//       ]
//       setMouseCoordinates(coordinates)
//     }

//     // Обработчик для очистки координат при уходе мыши с карты
//     const handlePointerLeave = () => {
//       setMouseCoordinates(null)
//     }

//     initialMap.on("pointermove", handlePointerMove)
//     mapRef.current.addEventListener("mouseleave", handlePointerLeave)

//     // Обработчик для обновления маршрута при изменении позиции метки
//     modify.on("modifyend", updatePointsAndRoute)

//     return () => {
//       initialMap.dispose()
//       if (mapRef.current) {
//         mapRef.current.removeEventListener("mouseleave", handlePointerLeave)
//       }
//     }
//   }, [markersLayer])

//   const updatePointsAndRoute = () => {
//     const features = markersLayer.getSource()?.getFeatures().sort((a, b) => a.get('order') - b.get('order'))
//     if (features) {
//       const newPoints = features.map((feature) => {
//         const geometry = feature.getGeometry() as Point
//         let xy = transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:4326") as [number, number]
//         return xy
//       })
//       setPoints(newPoints)
//       if (newPoints.length >= 2) {
//         calculateRoute(newPoints)
//       } else {
//         routeLayer.getSource()?.clear()
//         onRouteChange?.({
//           startAddress: "",
//           endAddress: "",
//           distance: 0,
//           duration: 0,
//         })
//       }
//     }
//   }

//   const calculateRoute = async (points: [number, number][]) => {
//     try {
//       const waypoints = points.map((point) => `${point[1]},${point[0]}`).join("|")
//       const response = await fetch(
//         `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=bicycle&type=short&lang=ru&apiKey=${apiKey}`,
//       )

//       if (!response.ok) throw new Error("Failed to calculate route")

//       const data = await response.json()

//       routeLayer.getSource()?.clear()

//       const coordinates = data.features[0].geometry.coordinates.map((x: any) =>
//         x.map((coord: [number, number]) => fromLonLat(coord)),
//       )

//       coordinates.forEach((coordArr: any) => {
//         const routeFeature = new Feature({
//           geometry: new LineString(coordArr)
//         })

//         routeLayer.getSource()?.addFeature(routeFeature)
//       })

//       // Получаем адреса и информацию о маршруте
//       const [startAddress, endAddress] = await Promise.all([
//         getAddress(points[0]),
//         getAddress(points[points.length - 1]),
//       ])

//       onRouteChange?.({
//         startAddress,
//         endAddress,
//         distance: data.features[0].properties.distance / 1000, // конвертируем в км
//         duration: data.features[0].properties.time / 60, // конвертируем в минуты
//       })
//     } catch (error) {
//       console.error("Error calculating route:", error)
//     }
//   }

//   const getAddress = async ([lon, lat]: [number, number]): Promise<string> => {
//     try {
//       const response = await fetch(
//         `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=ru&apiKey=${apiKey}`,
//       )

//       if (!response.ok) throw new Error("Failed to get address")

//       const data = await response.json()
//       return data.features[0].properties.formatted
//     } catch (error) {
//       console.error("Error getting address:", error)
//       return ""
//     }
//   }

  
//   useEffect(() => {
//     if (!map) return

//     const handleClick = async (event: any) => {
//       const clickedCoord = map.getCoordinateFromPixel(event.pixel)
//       const lonLat = transform(clickedCoord, "EPSG:3857", "EPSG:4326") as [number, number]

//       // Добавляем новую точку
//       const newPoints = [...points, lonLat]
//       setPoints(newPoints)

//       // Добавляем маркер на карту
//       const marker = new Feature({
//         geometry: new Point(clickedCoord),
//         order: index
//       })
//       markersLayer.getSource()?.addFeature(marker)
//       index += 1

//       // Если точек больше одной, строим маршрут
//       if (newPoints.length >= 2) {
//         await calculateRoute(newPoints)
//       }
//     }

//     map.on("click", handleClick)

//     return () => {
//       map.un("click", handleClick)
//     }
//   }, [map, points, markersLayer])

//   return (
//     <div
//       ref={mapRef}
//       className="w-full h-full min-h-[700px] sm:min-h-[600px] rounded-lg overflow-hidden relative"
//       style={{ aspectRatio: "16/9" }}
//     >
//       <CoordinatesDisplay coordinates={mouseCoordinates} />
//     </div>
//   )
// }


"use client"

import "ol/ol.css"
import { useEffect, useRef, useState } from "react"
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

interface RouteMapProps {
  markers: Array<{
    id: number
    address: string
    coordinates: [number, number]
  }>
  onMarkersChange: (
    markers: Array<{
      id: number
      address: string
      coordinates: [number, number]
    }>,
  ) => void
  onRouteChange?: (route: {
    startAddress: string
    endAddress: string
    distance: number
    duration: number
  }) => void
}

let nextId = 1

export function RouteMap({ markers, onMarkersChange, onRouteChange }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [mouseCoordinates, setMouseCoordinates] = useState<[number, number] | null>(null)
  const apiKey = import.meta.env.VITE_NEXT_PUBLIC_GEOAPIFY_API_KEY

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

  const [markersLayer] = useState(
    new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          src: "/marker.svg",
          width: 35,
          height: 45,
          anchor: [0.5, 1],
        }),
        zIndex: 12,
      }),
    }),
  )

  // Обновляем маркеры на карте при изменении их в состоянии
  useEffect(() => {
    if (!map) return

    // Добавляем взаимодействие для изменения позиции меток
    const modify = new Modify({ source: markersLayer.getSource()! })
    map.addInteraction(modify)

    const updatePonterFunc = (event: any) => {
      const feature = event.features.getArray()[0]
      const geometry = feature.getGeometry() as Point
      const coordinates = transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:4326") as [number, number]
        
      const id = feature.get("id")
      const markerIndex = markers.findIndex((m) => m.id === id)
      
      if (markerIndex !== -1) {
        const newMarkers = [...markers]
        newMarkers[markerIndex] = {
          ...newMarkers[markerIndex],
          coordinates,
        }
        onMarkersChange(newMarkers)
      }
    }

    // Обработчик для обновления маршрута при изменении позиции метки
    modify.on("modifyend", updatePonterFunc)

    markersLayer.getSource()?.clear()

    markers.forEach((marker) => {
      const coordinates = fromLonLat(marker.coordinates)
      const feature = new Feature({
        geometry: new Point(coordinates),
        id: marker.id,
      })
      markersLayer.getSource()?.addFeature(feature)
    })

    if (markers.length >= 2) {
      calculateRoute(markers.map((m) => m.coordinates))
    } else {
      routeLayer.getSource()?.clear()
    }
    
  }, [markers, map, markersLayer])

  useEffect(() => {
    if (!mapRef.current) return

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${apiKey}`,
          }),
        }),
        routeLayer,
        markersLayer,
      ],
      view: new View({
        center: fromLonLat([30.3141, 59.9386]),
        zoom: 11,
      }),
    })

    setMap(initialMap)

    const select = new Select({
      layers: [markersLayer],
      condition: click,
    })
    initialMap.addInteraction(select)

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
  }, [])

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

      // обновление начального адреса и конечного
      // const [start, end] = await Promise.all([
      //   getAddress(points[0]),
      //   getAddress(points[points.length - 1]),
      // ])

      // markers[0].address = start
      // markers[markers.length - 1].address = end

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
    if (!map) return

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

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[700px] sm:min-h-[600px] rounded-lg overflow-hidden relative"
      style={{ aspectRatio: "16/9" }}
    >
      <CoordinatesDisplay coordinates={mouseCoordinates} />
    </div>
  )
}


