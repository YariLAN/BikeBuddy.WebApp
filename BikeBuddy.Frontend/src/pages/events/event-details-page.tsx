"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ArrowLeft, Calendar, MapPin, Users, RouteIcon, Bike, Flag, UserRound } from "lucide-react"
import { RouteMapContainer, type RouteMapContainerRef } from "@/components/my/map/route-map-container"
import { BicycleType, type EventResponse, EventStatus, EventType, Point } from "@/core/models/event/event-models"
import useEventStore from "@/stores/event"
import { alertExpectedError } from "@/core/helpers"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const bikeTypes = [
  { value: BicycleType.Default, label: "Городской" },
  { value: BicycleType.Road, label: "Шоссейный" },
  { value: BicycleType.Mountain, label: "Горный" },
  { value: BicycleType.BMX, label: "BMX" },
  { value: BicycleType.Any, label: "Любой" },
]

const eventTypes = [
  { value: EventType.Solo, label: "Индивидуальный" },
  { value: EventType.Group, label: "Групповой" },
  { value: EventType.Leisure, label: "Прогулка" },
  { value: EventType.Race, label: "Веломарафон" },
  { value: EventType.Challenge, label: "Вызов" },
  { value: EventType.Training, label: "Тренировка" },
  { value: EventType.Tour, label: "Путешествие" },
]

const getStatusInfo = (status: EventStatus) => {
  switch (status) {
    case EventStatus.Opened:
      return { label: "Открыт", color: "bg-green-500" }
    case EventStatus.Closed:
      return { label: "Закрыт для присоединения", color: "bg-yellow-500" }
    case EventStatus.Completed:
      return { label: "Завершен", color: "bg-blue-500" }
    case EventStatus.Canceled:
      return { label: "Отменен", color: "bg-red-500" }
    default:
      return { label: "Неизвестно", color: "bg-gray-500" }
  }
}

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const routeMapRef = useRef<RouteMapContainerRef>(null)
  const [event, setEvent] = useState<EventResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const eventStore = useEventStore()

  const fetchEventDetails = async () => {
    if (!eventId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await eventStore.getEventById(eventId)

      if (result.data) {
        setEvent(result.data)

        if (result.data.points && result.data.points.length > 0 && routeMapRef.current) {
          routeMapRef.current.setPoints(result.data.points as Point[])
        }
      } else if (result.error) {
        setError(result.error)
        alertExpectedError(result.error)
      }
    } catch (error: any) {
      setError(error.message)
      alertExpectedError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEventDetails()
  }, [eventId, eventStore])

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    return format(date, "d MMMM yyyy", { locale: ru })
  }

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString)
    return format(date, "HH:mm", { locale: ru })
  }

  const getBicycleTypeLabel = (bicycleType: BicycleType): string => {
    const type = bikeTypes.find((t) => t.value === bicycleType)
    return type ? type.label : "Неизвестный"
  }

  const getEventTypeLabel = (eventType: EventType): string => {
    const type = eventTypes.find((t) => t.value === eventType)
    return type ? type.label : "Неизвестный"
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/events")} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад
          </Button>
          <Skeleton className="h-10 w-1/3" />
        </div>

        <div className="space-y-8">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-5 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/events")} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">Ошибка загрузки события</h1>
        </div>

        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Не удалось загрузить информацию о событии. Пожалуйста, попробуйте позже.</p>
          {error && <p className="mt-2 text-sm">{error}</p>}
        </div>

        <Button onClick={() => navigate("/events")} className="mt-6">
          Вернуться к списку событий
        </Button>
      </div>
    )
  }

  const statusInfo = getStatusInfo(event.status)

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={() => navigate("/events")} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">{event.name}</h1>

        <div className="ml-auto flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", statusInfo.color)} style={{ border: "1px black solid" }} />
          <span className="text-sm font-medium">{statusInfo.label}</span>
        </div>
      </div>

      {/* Карта */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-0">
          <RouteMapContainer ref={routeMapRef} readOnly={true} />
        </CardContent>
      </Card>

      {/* Информация о событии */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Описание</h2>
          <p className="text-muted-foreground whitespace-pre-line mb-6">{event.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium text-foreground">Дата и время</div>
                <div>
                  {formatDate(event.startDate)} в {formatTime(event.startDate)}
                </div>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <RouteIcon className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium text-foreground">Дистанция</div>
                <div>{event.distance / 1000} км</div>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium text-foreground">Старт</div>
                <div>{event.startAddress}</div>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium text-foreground">Финиш</div>
                <div>{event.endAddress}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1.5 rounded-md">
              <Bike className="mr-2 h-4 w-4" />
              <span className="font-medium">{getBicycleTypeLabel(event.bicycleType)}</span>
            </div>

            <div className="flex items-center bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1.5 rounded-md">
              <Flag className="mr-2 h-4 w-4" />
              <span className="font-medium">{getEventTypeLabel(event.type)}</span>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Организатор</h3>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-3">
                  <UserRound className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">{event.author.userName}</div>
                  <div className="text-sm text-muted-foreground">{event.author.email}</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Участники</h3>
              <div className="flex items-center text-muted-foreground mb-6">
                <Users className="mr-2 h-5 w-5" />
                <div>
                  <div className="font-medium text-foreground">Количество участников</div>
                  <div>{event.countMembers}</div>
                </div>
              </div>

              <Button 
                className={cn(
                    "w-full",
                    event.status === EventStatus.Opened && event.countMembers > 1
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                )}
                disabled={event.status !== EventStatus.Opened || event.countMembers == 1}
                title={event.status !== EventStatus.Opened || event.countMembers == 1 ? "Нельзя присоединиться к этому событию" : ""}>
                    {event.status === EventStatus.Opened && event.countMembers > 1 ? "Присоединиться к событию" : "Присоединение недоступно"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}