"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ArrowLeft, Calendar, MapPin, Users, RouteIcon, Bike, Flag, UserRound, MessageSquare, X } from "lucide-react"
import { RouteMapContainer, type RouteMapContainerRef } from "@/components/my/map/route-map-container"
import { BicycleType, type EventResponseDetails, EventStatus, EventType, PointDetails } from "@/core/models/event/event-models"
import useEventStore from "@/stores/event"
import { alertExpectedError, toastAlert } from "@/core/helpers"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import useChatStore from "@/stores/chat"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Swal from "sweetalert2"

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
  const [formData, setEvent] = useState<EventResponseDetails | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

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
        let event = result.data.event
        setEvent(result.data)

        if (event.points && event.points.length > 0 && routeMapRef.current) {
          routeMapRef.current.setPoints(event.points as PointDetails[])
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

  const useChat = useChatStore()

  const handleChatAction = async () => {
    if (!eventId) return;

    if (formData?.isMemberChat) {
      navigate(`/events/${eventId}/chat`, {state: { chatId: formData!.event.chatId } })
    } else {
      setIsJoining(true)

      try {
        const response = await useChat.registerInChat(formData!.event.chatId)

        if (response.data) {
          await fetchEventDetails()
          navigate(`/events/${eventId}/chat`, {state: { chatId: formData!.event.chatId } })
        }
      }
      catch (error : any) {
        alertExpectedError(error.message)
      }
      finally { setIsJoining(false) }
    }
  } 

  const showCancelDialog = async () => {
    Swal.fire({
      title: "Вы уверены, что хотите отменить этот заезд? Это действие нельзя отменить после.",
      showConfirmButton: true,
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "Да, отменить заезд",
      cancelButtonText: "Отменить действие",
      width: 650,
      customClass: {
        confirmButton: "btn btn-danger",
        popup: "swal-alert-info"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
       await handleCancelEvent()
      }
    });
  }

  const handleCancelEvent = async () => {
    if (!eventId || !formData?.canEdit) {
      return
    }

    setIsCancelling(true)

    try {
      const result = await eventStore.cancelEventById(eventId)

      if (result.data) {
        await fetchEventDetails()
        toastAlert("", "Заезд успешно отменен", 'success', 'center')
      } else if (result.error) {
        alertExpectedError(result.error)
      }
    } catch (error : any) {
      alertExpectedError(error.message)
    }
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

  if (error || !formData) {
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

  const statusInfo = getStatusInfo(formData.event.status)
  const canJoinChat = formData.event.status === EventStatus.Opened && formData.event.countMembers > 1

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={() => navigate("/events")} className="mr-10">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">{formData.event.name}</h1>

        <div className="ml-auto flex items-center gap-20">
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", statusInfo.color)} style={{ border: "1px black solid" }} />
            <span className="text-sm font-medium">{statusInfo.label}</span>
          </div>
          
          {formData.canEdit && formData.event.status !== EventStatus.Canceled && (
          <div className="flex items-center gap-10">
            {/* Кнопка отмены события (только для автора) */}
            
              <Button variant="destructive" className=""  onClick={() => showCancelDialog()}>
                <X className="mr-2 h-4 w-4" />
                Отменить заезд
              </Button>
            </div>
          )}  
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
          <p className="text-muted-foreground whitespace-pre-line mb-6">{formData.event.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium text-foreground">Дата и время</div>
                <div>
                  {formatDate(formData.event.startDate)} в {formatTime(formData.event.startDate)}
                </div>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <RouteIcon className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium text-foreground">Дистанция</div>
                <div>{formData.event.distance / 1000} км</div>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium text-foreground">Старт</div>
                <div>{formData.event.startAddress}</div>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium text-foreground">Финиш</div>
                <div>{formData.event.endAddress}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1.5 rounded-md">
              <Bike className="mr-2 h-4 w-4" />
              <span className="font-medium">{getBicycleTypeLabel(formData.event.bicycleType)}</span>
            </div>

            <div className="flex items-center bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1.5 rounded-md">
              <Flag className="mr-2 h-4 w-4" />
              <span className="font-medium">{getEventTypeLabel(formData.event.type)}</span>
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
                  <div className="font-medium">{formData.event.author.userName}</div>
                  <div className="text-sm text-muted-foreground">{formData.event.author.email}</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Участники</h3>
              <div className="flex items-center text-muted-foreground mb-6">
                <Users className="mr-2 h-5 w-5" />
                <div>
                  <div className="font-medium text-foreground">Количество зарегистрированных участников</div>
                  <div>{formData.event.currentCountMembers} из {formData.event.countMembers}</div>
                </div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button 
                        className={cn(
                            "w-full",
                            formData.isMemberChat || canJoinChat
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                        )}
                        disabled={ !formData.isMemberChat && !canJoinChat }
                        onClick={handleChatAction}
                        title={!formData.isMemberChat && !canJoinChat? "Нельзя присоединиться к этому событию" : ""}
                      >
                        {
                          isJoining ? (
                            "Присоединение..."
                          ) : (
                            <>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              {formData.isMemberChat 
                                ? "Открыть чат"
                                : formData.event.status === EventStatus.Opened && formData.event.countMembers > 1 
                                  ? "Присоединиться к событию" 
                                  : "Присоединение недоступно"}
                            </>
                          )
                        }
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!formData.isMemberChat && !canJoinChat && (
                    <TooltipContent>
                      <p>
                        {formData.event.countMembers <= 1
                          ? "Для чата необходимо минимум 2 участника"
                          : `Нельзя присоединиться к событию со статусом "${statusInfo.label}"`}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}