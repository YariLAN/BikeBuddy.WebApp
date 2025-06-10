import { Button } from "@/components/ui/button"
import { Plus, Calendar, MapPin, Users, Route, LayoutGrid, List, SlidersHorizontal, UserRound, Loader, ChevronLeft, ChevronRight, Bike, Flag, ArrowRight, X } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils" 
import { BicycleType, EventFilterDto, EventListResponse, EventStatus, EventType } from "@/core/models/event/event-models"
import { SearchFilterDto } from "@/stores/search_types"
import useEventStore from "@/stores/event"
import { alertExpectedError } from "@/core/helpers"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

const bikeTypes = [
  { value: BicycleType.Default,  label: 'Городской' },
  { value: BicycleType.Road,     label: 'Шоссейный' },
  { value: BicycleType.Mountain, label: 'Горный' },
  { value: BicycleType.BMX,      label: 'BMX' },
  { value: BicycleType.Any,      label: 'Любой' },
]

const eventTypes = [
  { value: EventType.Solo,      label: 'Индивидуальный' },
  { value: EventType.Group,     label: 'Групповой' },
  { value: EventType.Leisure,   label: 'Прогулка' },
  { value: EventType.Race,      label: 'Веломарафон' },
  { value: EventType.Challenge, label: 'Вызов' },
  { value: EventType.Training,  label: 'Тренировка'},
  { value: EventType.Tour,      label: 'Путешествие'}
]

interface ActiveFilterTagProps {
  label: string;
  value: string | number;
  onRemove: () => void;
  icon?: React.ReactNode;
}

const ActiveFilterTag = ({ label, value, onRemove, icon }: ActiveFilterTagProps) => (
  <div className="flex items-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100 px-2 py-1 rounded-md mr-2 mb-2">
    {icon && <span className="mr-1">{icon}</span>}
    <span className="text-xs font-medium">
      {label}: {value}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={onRemove}
      className="h-5 w-5 p-0 ml-1 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800/30"
    >
      <X className="h-3 w-3" />
      <span className="sr-only">Очистить фильтр</span>
    </Button>
  </div>
);

export default function EventsPage() {
  const navigate = useNavigate()
  const [isCompactView, setIsCompactView] = useState(false)
  const [events, setEvents] = useState<Array<EventListResponse>>([])
  const [totalCountEvents, setTotalCountEvents] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [participantsFilter, setParticipantsFilter] = useState<number>(0)
  const [startAddressFilter, setSartAddressFilter] = useState<string>("")

  const [countNotApplyedFilter, setCountNotApplyedFilter] = useState<number>(0)
  const [startAddressNotApplyedFilter, setStartAddressNotApplyedFilter] = useState<string>("")

  const [isFilterActive, setIsFilterActive] = useState(false)

  const [offset, setOffset] = useState(0)
  const limit = 8

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

  const setBicycleType = function (bicycleType : BicycleType) : string {
    const typeBicycle = bikeTypes.find((t) => t.value === bicycleType)
    return typeBicycle ? typeBicycle.label : "Неизвестный"
  }

  const setEventType = (eventType: EventType): string => {
    const type = eventTypes.find((t) => t.value === eventType)
    return type ? type.label : "Неизвестный"
  }

  const getStatusInfo = (status: EventStatus) => {
    switch (status) {
      case EventStatus.Opened:
        return { label: "Открыт", color: "bg-green-500 hover:bg-green-600" }
      case EventStatus.Closed:
        return { label: "Закрыт для присоединения", color: "bg-yellow-500 hover:bg-yellow-600" }
      case EventStatus.Started:
        return { label: "Начат", color : "bg-cyan-500 hover:bg-cyan-600"}
      case EventStatus.Completed:
        return { label: "Завершен", color: "bg-blue-500 hover:bg-blue-600" }
      case EventStatus.Canceled:
        return { label: "Отменен", color: "bg-red-500 hover:bg-red-600" }
      default:
        return { label: "Неизвестно", color: "bg-gray-500 hover:bg-gray-600" }
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
        filter: { 
          countMembers: participantsFilter,
          startAddress: startAddressFilter 
        }
      }

      const result = await eventStore.getEvents(filter)

      if (result.data != null) {
        setEvents(result.data.body)
        setTotalCountEvents(result.data.total)
      }
      else {
        alertExpectedError(result.error!) 
      }
    } catch (error : any) {
      alertExpectedError(error.message!) 
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getEvents()
  }, [offset, participantsFilter, startAddressFilter])

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    return format(date, "d MMMM yyyy", { locale: ru })
  }

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString)
    return format(date, "HH:mm", { locale: ru })
  }

  const applyFilter = () => {
    setParticipantsFilter(countNotApplyedFilter)
    setSartAddressFilter(startAddressNotApplyedFilter)

    setOffset(0)
    setIsFilterActive(countNotApplyedFilter > 0 || !!startAddressNotApplyedFilter)
    setIsFilterOpen(false)
  }

  const clearFilter = () => {
    setParticipantsFilter(0)
    setSartAddressFilter("")

    setCountNotApplyedFilter(0)
    setStartAddressNotApplyedFilter("")

    setIsFilterActive(false)
    setOffset(0)
    setIsFilterOpen(false)
  }

  return (
    <div className="px-7 sm:px-7 md:px-20 lg:px-16 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Велособытия</h1>
        <div className="flex items-center gap-4">

          {/* Кнопка фильтров */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={isFilterActive ? "default" : "outline"}
                size="icon"
                className={isFilterActive ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 z-50 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Фильтры</h4>
                  {isFilterActive && (
                    <Button variant="outline" size="sm" onClick={clearFilter} className="h-8 px-2 text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Сбросить
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="participants">Минимальное количество участников</Label>
                    <span className="text-sm font-medium">{countNotApplyedFilter}</span>
                  </div>
                  <Slider
                    id="participants"
                    min={0}
                    max={20}
                    step={1}
                    value={[countNotApplyedFilter]}
                    onValueChange={(value) => setCountNotApplyedFilter(value[0])}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Адрес стартовой точки</Label>
                  <Input
                    id="address"
                    placeholder="Введите адрес"
                    value={startAddressNotApplyedFilter}
                    onChange={(e) => setStartAddressNotApplyedFilter(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
                    Отмена
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => applyFilter()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Применить
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

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

      {isFilterActive && (
        <div className="mb-4">
          <span className="text-sm text-muted-foreground mr-2">Активные фильтры:</span>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {participantsFilter > 0 && (
              <ActiveFilterTag
                label="Мин. участников"
                value={participantsFilter}
                onRemove={() => {
                  setParticipantsFilter(0)
                  setCountNotApplyedFilter(0)

                  setOffset(0)
                  setIsFilterActive(!!startAddressNotApplyedFilter)
                  setIsFilterOpen(false)
                }}
                icon={<Users className="h-3 w-3" />}
              />
            )}
            
            {startAddressFilter && (
              <ActiveFilterTag
                label="Адрес старта"
                value={startAddressFilter}
                onRemove={() => {
                  setSartAddressFilter("")
                  setStartAddressNotApplyedFilter("")

                  setOffset(0)
                  setIsFilterActive(countNotApplyedFilter > 0)
                  setIsFilterOpen(false)
                }}
                icon={<MapPin className="h-3 w-3" />}
              />
            )}
          </div>
        </div>
      )}

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
          <p className="text-lg mb-4">
            {isFilterActive ? "Нет событий, соответствующих выбранным фильтрам" : "Пока нет созданных событий"}
          </p>

          {!isFilterActive ? (
            <Button onClick={() => navigate("/events/create")}>
              <Plus className="mr-2 h-5 w-5" />
              Создать первое событие
            </Button>
          ) : (
            <Button variant="outline" onClick={clearFilter}>
              <X className="mr-2 h-5 w-5" />
              Сбросить фильтры
            </Button>
          )}
        </div>
      ) : (        
        <>
          <div className={cn(
              "py-5 grid gap-8",
              isCompactView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {events.map((event) => {
              const statusInfo = getStatusInfo(event.status)

              return (
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
                      "flex justify-center items-center relative" 
                  )}>
                    <img 
                      src={event.imageUrl || "/map-default.png"}
                      alt={event.name}
                      className={cn("object-cover", isCompactView ? "h-full w-full" : event.imageUrl ? "w-full" : "w-[350px]")}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <div style={{border: '1px black solid'}} className={cn("w-3 h-3 rounded-full", statusInfo.color)} />
                            <span className="text-xs font-medium bg-black/60 text-white px-2 py-0.5 rounded">
                              {statusInfo.label}
                            </span>
                            {event.isCorfirmedByAuthor && (
                              <span className="text-xs font-medium bg-green-500 text-white px-2 py-0.5 rounded">✓</span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Статус: {statusInfo.label} {event.isCorfirmedByAuthor ? " (подтверждено)" : ""}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-green-300 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-md">
                              <Bike className="mr-1 h-3 w-3" />
                              <span className="text-xs font-medium">{setBicycleType(event.bicycleType)}</span>
                          </div>
                        </div>  
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-md">
                              <Flag className="mr-1 h-3 w-3" />
                            <span className="text-xs font-medium">{setEventType(event.type)}</span>
                          </div>
                        </div>                    
                      </div>
                      <Button 
                        className={cn(
                          "w-full mt-4 bg-black text-white",
                          "transition-all duration-200 group"
                        )}
                        onClick={() => navigate(`/events/${event.eventId}`)}
                      >
                        <span>Подробнее</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
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