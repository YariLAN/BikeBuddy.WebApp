import { Button } from "@/components/ui/button"
import { Plus, Calendar, MapPin, Users, Route, LayoutGrid, List, SlidersHorizontal, UserRound, Loader, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils" 
import { EventFilterDto, EventListResponse } from "@/core/models/event/event-models"
import { SearchFilterDto } from "@/stores/search_types"
import useEventStore from "@/stores/event"
import { alertExpectedError } from "@/core/helpers"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export default function EventsPage() {
  const navigate = useNavigate()
  const [isCompactView, setIsCompactView] = useState(false)
  const [events, setEvents] = useState<Array<EventListResponse>>([])
  const [totalCountEvents, setTotalCountEvents] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [offset, setOffset] = useState(0)
  const limit = 10

  const totalPages = Math.ceil(totalCountEvents / limit)
  const currentPage = Math.floor(offset / limit) + 1

  const goToNextPage = () => {
    if (offset + limit < totalCountEvents) {
      setOffset(offset + limit)
    }
  }

  const goToPrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit)
    }
  }

  const eventStore = useEventStore()

  const getEvents = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const filter: SearchFilterDto<EventFilterDto> = {
        offset: offset, 
        limit : limit,
        filter: { countMembers: 0}
      }

      const result = await eventStore.getEvents(filter)

      if (result.data != null) {
        setEvents(result.data.body)
        setTotalCountEvents(result.data.total)
      }
      else {
        alertExpectedError(result.error!) 
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getEvents()
  }, [offset])

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    return format(date, "d MMMM yyyy", { locale: ru })
  }

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString)
    return format(date, "HH:mm", { locale: ru })
  }

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

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Загрузка событий...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20">
          <p className="text-lg mb-4">Пока нет созданных событий</p>
          <Button onClick={() => navigate("/events/create")}>
            <Plus className="mr-2 h-5 w-5" />
            Создать первое событие
          </Button>
        </div>
      ) : (        
        <>
          <div className={cn(
              "py-5 grid gap-8",
              isCompactView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {events.map((event) => (
              <Card 
                key={event.eventId} 
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
                    : "w-full",
                    "flex justify-center items-center" 
                )}>
                  <img 
                    src={event.imageUrl || "/map-default.png"}
                    alt={event.name}
                    className={cn("object-cover", isCompactView ? "h-full w-full" : event.imageUrl ? "w-full" : "w-[350px]")}
                  />
                </div>
                
                <div className={cn("flex flex-col",isCompactView ? "flex-1" : "w-full")}>
                  <CardHeader>
                    <CardTitle className="text-xl">{event.name}</CardTitle>
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
                        <span>
                          {formatDate(event.startDate)} в {formatTime(event.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.startAddress}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{event.countMembers} участников</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Route className="mr-2 h-4 w-4" />
                        <span>{event.distance} км</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <UserRound className="mr-2 h-4 w-4" />
                        <span>{event.nameAuthor}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => navigate(`/events/${event.eventId}`)}
                    >
                      Подробнее
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={offset === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="mx-4">
                Страница {currentPage} из {totalPages}
              </span>

              <Button variant="outline" size="icon" onClick={goToNextPage} disabled={offset + limit >= totalCountEvents}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}