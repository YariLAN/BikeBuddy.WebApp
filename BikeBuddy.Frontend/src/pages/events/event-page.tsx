import { Button } from "@/components/ui/button"
import { Plus, Calendar, MapPin, Users, Route, LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils" 

// Временные данные для демонстрации
const tempEvents = [
  {
    id: 1,
    title: "Велопрогулка по историческому центру",
    date: "2024-02-15",
    time: "10:11",
    location: "Площадь Ленина",
    participants: 5,
    distance: "15 км",
    description: "Неспешная прогулка по историческим местам города с остановками у главных достопримечательностей.",
    image: "/Снимок экрана 2025-02-02 025449.jpg",
  },
  {
    id: 2,
    title: "Загородный веломаршрут",
    date: "2024-02-20",
    time: "09:00",
    location: "Парк Победы",
    participants: 8,
    distance: "30 км",
    description: "Активная поездка по живописным местам за городом. Подходит для опытных велосипедистов.",
    image: "/Снимок экрана 2025-02-02 025449.jpg",
  },
  {
    id: 3,
    title: "Вечерний велозаезд",
    date: "2024-02-25",
    time: "19:00",
    location: "Центральный парк",
    participants: 12,
    distance: "10 км",
    description: "Романтическая вечерняя прогулка по освещенным паркам и набережным города.",
    image: "/image.png",
  },
  {
    id: 4,
    title: "Вечерний велозаезд",
    date: "2024-02-25",
    time: "19:00",
    location: "Центральный парк",
    participants: 12,
    distance: "10 км",
    description: "Романтическая вечерняя прогулка по освещенным паркам и набережным города.",
    image: "/Снимок экрана 2025-02-02 025449.jpg",
  },
  {
    id: 5,
    title: "Вечерний велозаезд",
    date: "2024-02-25",
    time: "19:00",
    location: "Центральный парк",
    participants: 12,
    distance: "10 км",
    description: "Романтическая вечерняя прогулка по освещенным паркам и набережным города.",
    image: "/Снимок экрана 2025-02-02 025449.jpg",
  }
]

export default function EventsPage() {
  const navigate = useNavigate()
  const [isCompactView, setIsCompactView] = useState(false)

  return (
    <div className="px-7 sm:px-7 md:px-20 lg:px-16 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Велособытия</h1>
        <div className="flex items-center gap-4">

          {/* Кнопка фильтров */}
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          {/* Кнопки управления видом */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "px-3",
                !isCompactView && "bg-background shadow-sm"
              )}
              onClick={() => setIsCompactView(false)}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "px-3 ml-1",
                isCompactView && "bg-background shadow-sm"
              )}
              onClick={() => setIsCompactView(true)}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Кнопка создания события */}
          <Button 
            onClick={() => navigate('/events/create')}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Создать событие
          </Button>
        </div>
      </div>

      <div className={cn(
        "py-5 grid gap-8",
        isCompactView 
          ? "grid-cols-1" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      )}>
        {tempEvents.map((event) => (
          <Card 
            key={event.id} 
            className={cn(
              "overflow-hidden transition-all duration-200",
              "hover:shadow-lg",
              "bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30",
              isCompactView && "lg:flex lg:flex-row"
            )}
          >
            <div className={cn(
              isCompactView 
                ? "lg:w-[500px] flex-shrink-0" 
                : "w-full"
            )}>
              <img 
                src={event.image || "/placeholder.svg"} 
                alt={event.title}
                className={cn(
                  "object-cover",
                  isCompactView 
                    ? "h-full w-full" 
                    : "w-full"
                )}
              />
            </div>
            
            <div className={cn(
              "flex flex-col",
              isCompactView ? "flex-1" : "w-full"
            )}>
              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className={cn(
                isCompactView && "flex-1 flex flex-col"
              )}>
                <p className={cn(
                  "text-muted-foreground mb-4 line-clamp-2",
                  isCompactView && "flex-1"
                )}>
                  {event.description}
                </p>
                <div className={cn(
                  "space-y-2 text-sm",
                  isCompactView && "grid grid-cols-2 gap-2 space-y-0"
                )}>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{event.date} в {event.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{event.participants} участников</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Route className="mr-2 h-4 w-4" />
                    <span>{event.distance}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  Подробнее
                </Button>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}