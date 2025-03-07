"use client"

import { useRef, useState } from "react"
import { ValidationService } from "@/core/services/ValidationService"
import { eventSchema, type EventFormData } from "@/core/validations/event"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2, AlertCircle, Upload } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RouteMapContainer, RouteMapContainerRef } from "@/components/my/map/route-map-container"
import { BicycleType, EventType, Marker, markerToPoint } from "@/core/models/event-models"

const validationService = new ValidationService(eventSchema)

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


export default function CreateEventPage() {
  const routeMapRef = useRef<RouteMapContainerRef>(null)
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    title: '',
    description: '',
    type: undefined,
    bikeType: undefined,
    startAddress: '',
    endAddress: '',
    startDateTime: undefined,
    endDateTime: undefined,
    distance: undefined,
    count_members: undefined,
    images: [],
    points: [],
    mapImageDataUrl: ''
  })
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = async (field: string, value: any) => {
    await validationService.validateField(field, value, setErrors)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(e)
    setIsSubmitting(true)

    const validateResult = await validationService.validateForm(formData)

    if (!validateResult.isValid) {
      setErrors(validateResult.errors)
      setIsSubmitting(false)
      return
    }

    try {
      const mapExport = await routeMapRef.current?.exportMap()
      
      formData.mapImageDataUrl = mapExport?.imageData
      formData.points = mapExport?.markers.map(m => markerToPoint(m))
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Form data:", formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFormField = (
    name: string,
    label: string,
    _tooltip: string,
    component: React.ReactNode,
    positionTooltip: string = "right-3"
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">
        {label}
      </label>
      <div className="relative">
        {component}
        {errors[name] && (
          <div className={`absolute ${positionTooltip} top-1/2 transform -translate-y-1/2`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors[name]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold mb-8">Создание события</h1>
      
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Название */}
        {renderFormField(
          'title',
          'Название',
          'Введите название события',
          <Input
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={errors.title ? 'border-red-500' : ''}
          />
        )}

        {/* Карта */}
        <RouteMapContainer 
            ref={routeMapRef}
            onRouteChange={({ startAddress, endAddress, distance, duration }) => {
                setFormData(prev => ({
                ...prev,
                startAddress,
                endAddress,
                distance,
                endDateTime: prev.startDateTime 
                    ? new Date(prev.startDateTime.getTime() + duration * 60000)
                    : undefined
                }))
            }}
        />

        {/* Описание */}
        {renderFormField(
          'description',
          'Описание',
          'Подробно опишите событие',
          <Textarea
            value={formData.description || ''}
            maxLength={400}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={cn(
              "max-h-[200px]",
              "min-h-[150px]",
              errors.description && "border-red-500"
            )}
          />
        )}

        {/* Тип заезда и тип велосипеда */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFormField(
            'type',
            'Тип заезда',
            'Выберите рекомендуемый тип велосипеда',
            <Select
              value={formData.type?.toString()}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger className={errors.bikeType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value.toString()}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>,
            'right-8'
          )}

          {renderFormField(
            'bikeType',
            'Тип велосипеда',
            'Выберите рекомендуемый тип велосипеда',
            <Select
              value={formData.bikeType?.toString()}
              onValueChange={(value) => handleInputChange('bikeType', value)}
            >
              <SelectTrigger className={errors.bikeType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Выберите тип велосипеда" />
              </SelectTrigger>
              <SelectContent>
                {bikeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value.toString()}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>,
            'right-8'
          )}
        </div>

        {/* Дистанция и кол-во участников */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFormField(
            'count_members',
            'Количество участников заезда (включая вас)',
            'Введите число участников',
            <Input
              type="number"
              value={formData.count_members}
              onChange={(e) => handleInputChange('count_members', Number(e.target.value))}
            />,
            'right-8'
          )}

          {renderFormField(
            'distance',
            'Длина маршрута',
            'Рассчитывается автоматически',
            <Input
              type="number"
              value={formData.distance || ''}
              disabled
              className="bg-muted"
            />
          )}

        </div>

        {/* Адреса и время */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Начало */}
          <div className="space-y-6">
            {renderFormField(
              'startAddress',
              'Адрес старта',
              'Выберите точку старта на карте',
              <Input
                value={formData.startAddress || ''}
                onChange={(e) => handleInputChange('startAddress', e.target.value)}
                className={errors.startAddress ? 'border-red-500' : ''}
              />
            )}

            {renderFormField(
              'startDateTime',
              'Начало события',
              'Выберите дату и время начала',
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDateTime && "text-muted-foreground",
                      errors.startDateTime && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDateTime ? (
                      format(formData.startDateTime, "PPp", { locale: ru })
                    ) : (
                      <span>Выберите дату и время</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDateTime}
                    onSelect={(date) => handleInputChange('startDateTime', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Конец */}
          <div className="space-y-6">
            {renderFormField(
              'endAddress',
              'Адрес финиша',
              'Выберите точку финиша на карте',
              <Input
                value={formData.endAddress || ''}
                onChange={(e) => handleInputChange('endAddress', e.target.value)}
                className={errors.endAddress ? 'border-red-500' : ''}
              />
            )}

            {renderFormField(
              'endDateTime',
              'Конец события',
              'Рассчитывается автоматически',
              <Input
                value={formData.endDateTime ? format(formData.endDateTime, "PPp", { locale: ru }) : ''}
                disabled
                className="bg-muted"
              />
            )}
          </div>
        </div>

        {/* Загрузка изображений */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Дополнительные фотографии
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square rounded-lg border-2 border-dashed",
                  "flex items-center justify-center",
                  "cursor-pointer hover:border-primary/50 transition-colors",
                  index < (formData.images?.length || 0)
                    ? "border-primary bg-primary/10"
                    : "border-muted"
                )}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Максимум 5 изображений
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Создать событие
          </Button>
        </div>
      </form>
    </div>
  )
}
