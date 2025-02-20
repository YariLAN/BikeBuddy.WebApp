interface CoordinatesDisplayProps {
    coordinates: [number, number] | null
  }
  
  export function CoordinatesDisplay({ coordinates }: CoordinatesDisplayProps) {
    if (!coordinates) return null
  
    const [longitude, latitude] = coordinates
  
    return (
      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="text-sm font-mono">
          <span className="font-semibold mr-1">Широта:</span>
          {latitude.toFixed(6)}°
        </p>
        <p className="text-sm font-mono">
          <span className="font-semibold mr-1">Долгота:</span>
          {longitude.toFixed(6)}°
        </p>
      </div>
    )
  }
  
  