"use client"

import 'ol/ol.css'

import { useEffect, useRef, useState } from 'react'
import { Map } from 'ol'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, transform } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { LineString, Point, } from 'ol/geom'
import { Style, Stroke, Circle, Fill } from 'ol/style'

interface RouteMapProps {
  onRouteChange?: (route: {
    startAddress: string
    endAddress: string
    distance: number
    duration: number
  }) => void
}

export function RouteMap({ onRouteChange }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const apiKey = import.meta.env.VITE_NEXT_PUBLIC_GEOAPIFY_API_KEY

  const [routeLayer] = useState(
    new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: 'black',
          width: 3
        })
      })
    })
  )
  const [markersLayer] = useState(
    new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: '#4CAF50' }),
          stroke: new Stroke({
            color: '#FFF',
            width: 2
          })
        })
      })
    })
  )

  const [points, setPoints] = useState<[number, number][]>([])

  useEffect(() => {
    if (!mapRef.current) return

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${apiKey}`,
          })
        }),
        routeLayer,
        markersLayer
      ],
      view: new View({
        center: fromLonLat([30.3141, 59.9386 ]), // Спб
        zoom: 11
      })
    })

    setMap(initialMap)

    return () => {
      initialMap.dispose()
    }
  }, [routeLayer, markersLayer])

  const calculateRoute = async (points: [number, number][]) => {
    try {
      const waypoints = points.map(point => `${point[1]},${point[0]}`).join('|')
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=bicycle&apiKey=${apiKey}`
      )

      if (!response.ok) throw new Error('Failed to calculate route')

      const data = await response.json()

      routeLayer.getSource()?.clear()

      const coordinates = (data.features[0].geometry.coordinates.map((x : any) =>
         x.map( (coord: [number, number]) => fromLonLat(coord) )
      ))

      coordinates.forEach( (coordArr : any) => {
        const routeFeature = new Feature({
          geometry: new LineString(coordArr)
        })
  
        routeLayer.getSource()?.addFeature(routeFeature)
      });


      // Получаем адреса и информацию о маршруте
      const [startAddress, endAddress] = await Promise.all([
        getAddress(points[0]),
        getAddress(points[points.length - 1])
      ])

      onRouteChange?.({
        startAddress,
        endAddress,
        distance: data.features[0].properties.distance / 1000, // конвертируем в км
        duration: data.features[0].properties.time / 60 // конвертируем в минуты
      })
    } catch (error) {
      console.error('Error calculating route:', error)
    }
  }

  const getAddress = async ([lon, lat]: [number, number]): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
      )

      if (!response.ok) throw new Error('Failed to get address')

      const data = await response.json()
      return data.features[0].properties.formatted
    } catch (error) {
      console.error('Error getting address:', error)
      return ''
    }
  }

  useEffect(() => {
    if (!map) return

    const handleClick = async (event: any) => {
      const clickedCoord = map.getCoordinateFromPixel(event.pixel)
      let lonLat = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326') as [number, number]

      // Добавляем новую точку
      const newPoints = [...points, lonLat]
      setPoints(newPoints)

      // Добавляем маркер на карту
      const marker = new Feature({
        geometry: new Point(clickedCoord)
      })
      markersLayer.getSource()?.addFeature(marker)

      // Если точек больше одной, строим маршрут
      if (newPoints.length >= 2) {
        await calculateRoute(newPoints)
      }
    }

    map.on('click', handleClick)

    return () => {
      map.un('click', handleClick)
    }
  }, [map, points, markersLayer, routeLayer])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[700px] sm:min-h-[600px] rounded-lg overflow-hidden relative" 
      style={{ aspectRatio: '16/9' }} 
    />
  )
}