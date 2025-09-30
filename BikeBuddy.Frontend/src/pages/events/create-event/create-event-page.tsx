"use client"

import React, { useEffect, useRef, useState } from "react"
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
import { CalendarIcon, Loader2, AlertCircle, Upload, ArrowLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RouteMapContainer, RouteMapContainerRef } from "@/components/my/map/route-map-container"
import { bikeTypes, CreateEventRequest, EventStatus, eventTypes, UpdateEventRequest } from "@/core/models/event/event-models"
import useEventStore from "@/stores/event"
import { alertExpectedError, alertInfo, toastAlert } from "@/core/helpers"
import JwtService from "@/core/services/JwtService"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { markerToPointDetails } from "@/core/mappers/event-mapper"
import { ApiResponse } from "@/core/services/ApiService"

const validationService = new ValidationService(eventSchema)

export default function CreateEventPage() {
  const eventStore = useEventStore()

  const { eventId } = useParams<{ eventId: string}>()
  const isEditMode = !!eventId
  
  const location = useLocation()
  const eventData = location.state?.eventData

  const navigate = useNavigate()
  const routeMapRef = useRef<RouteMapContainerRef>(null)
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    name: '',
    description: '',
    type: undefined,
    bicycleType: undefined,
    startAddress: '',
    endAddress: '',
    startDate: undefined,
    endDate: undefined,
    distance: undefined,
    countMembers: undefined,
    currentCountMembers: undefined,
    points: [],
    status: EventStatus.Opened,
    // images: [],
    // mapImageFile: null
  })
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  useEffect(() => {
    if (isEditMode && eventId) {
      if (eventData) {
        setFormData({
          name: eventData.name,
          description: eventData.description,
          type: eventData.type,
          bicycleType: eventData.bicycleType,
          countMembers: eventData.countMembers,
          currentCountMembers: eventData.currentCountMembers,
          distance: eventData.distance,
          startAddress: eventData.startAddress,
          endAddress: eventData.endAddress,
          startDate: new Date(eventData.startDate),
          endDate: new Date(eventData.endDate),
          points: eventData.points,
          status: eventData.status,
        })

        if (eventData.points && eventData.points.length > 0 && routeMapRef.current) {
          routeMapRef.current.setPoints(eventData.points)
        }
      }
    }
  }, [eventId, isEditMode])

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const formattedDate = (date : Date) => {
    const dateCopy = new Date(date)
    const timezoneOffset = dateCopy.getTimezoneOffset() * 60000
    return new Date(dateCopy.getTime() - timezoneOffset)
  }

  const validateField = async (field: string, value: any) => {
    await validationService.validateField(field, value, setErrors)
  }

  const handleInputChange = (field: keyof Partial<EventFormData>, value: any) => {
    if (field == 'type' || field == 'bicycleType') {
      setFormData(prev => ({ ...prev, [field]: Number(value) }))
    } 
    else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
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
      formData.startDate = formattedDate(formData.startDate!)
      formData.endDate = formattedDate(formData.endDate!)

      console.log("Form data:", formData)
      const mapExport = await routeMapRef.current?.exportMap()
      formData.points = mapExport?.markers.map(m => markerToPointDetails(m))

      let result: ApiResponse<boolean | string>;
      if (isEditMode) {
        result = await eventStore.updateEvent(eventId, formData as UpdateEventRequest)
      } else {
        formData.userId = JwtService.decodeToken()?.nameId
        result = await eventStore.createEvent(formData as CreateEventRequest)
      }
          
      if (result.error) { 
        alertExpectedError(result.error) 
        return
      }

      var resultUpload = await eventStore.uploadMap(isEditMode ? eventId : result.data! as string, mapExport!.blobImage!)

      if (resultUpload.error) { 
        alertExpectedError(resultUpload.error) 
      }
      else {
        alertInfo("", isEditMode ? "Заезд успешно обновлен" : "Заезд успешно создан", 'success')
      }
      await new Promise(resolve => setTimeout(resolve, 1000))

      isEditMode 
        ? navigate(`/events/${eventId}`) 
        : navigate('/events')

    } catch (error: any) {
      alertExpectedError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file?.type.startsWith('image/')) {
      toastAlert('Выберите файл изображения', '', 'error', 'bottom-right')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toastAlert('Размер изображения не должен превышать 5 МБ', '', 'error', 'bottom-right')
      return
    }

    const previewUrl = URL.createObjectURL(file)

    const newImages = [...uploadedImages]
    const newPreviews = [...imagePreviewUrls]
    
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index])
    }

    newImages[index] = file
    newPreviews[index] = previewUrl

    setUploadedImages(newImages)
    setImagePreviewUrls(newPreviews)
  }

  const handleRemoveImage = (index: number) => {
      const newImages = [...uploadedImages]
      const newPreviews = [...imagePreviewUrls]

      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index])
      }

      newImages.splice(index, 1)
      newPreviews.splice(index, 1)

      setUploadedImages(newImages)
      setImagePreviewUrls(newPreviews)

      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = ""
      }
  }

  const handleImageClick = (index: number) => {
    fileInputRefs.current[index]?.click()
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
      <div className="flex items-center mb-8">
        <Button variant='outline' onClick={() => isEditMode ? navigate(`/events/${eventId}`) : navigate("/events")} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold ml-6">{isEditMode ? "Редактирование заезда" : "Создание заезда"}</h1>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Название */}
        {renderFormField(
          'name',
          'Название',
          'Введите название события',
          <Input
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-red-500' : ''}
          />
        )}

        {/* Карта */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <RouteMapContainer 
                ref={routeMapRef}
                onRouteChange={({ startAddress, endAddress, distance, duration }) => {
                    setFormData(prev => ({
                    ...prev,
                    startAddress,
                    endAddress,
                    distance,
                    endDate: prev.startDate 
                        ? new Date(prev.startDate.getTime() + duration * 60000)
                        : undefined
                    }))
                }}
            />
          </CardContent>
        </Card>

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
              disabled={formData.status === EventStatus.Started}
              value={formData.type?.toString()}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
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
            'bicycleType',
            'Тип велосипеда',
            'Выберите рекомендуемый тип велосипеда',
            <Select
              disabled={formData.status === EventStatus.Started}
              value={formData.bicycleType?.toString()}
              onValueChange={(value) => handleInputChange('bicycleType', value)}
            >
              <SelectTrigger className={errors.bicycleType ? 'border-red-500' : ''}>
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
            'countMembers',
            'Количество участников заезда (включая вас)',
            'Введите число участников',
            <Input
              type="number"
              disabled={formData.status === EventStatus.Started}
              min={isEditMode ? formData.currentCountMembers : 0}
              value={formData.countMembers}
              onChange={(e) => handleInputChange('countMembers', Number(e.target.value))}
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
                disabled={formData.status === EventStatus.Started}
                value={formData.startAddress || ''}
                onChange={(e) => handleInputChange('startAddress', e.target.value)}
                className={errors.startAddress ? 'border-red-500' : ''}
              />
            )}

            {renderFormField(
              'startDate',
              'Начало события',
              'Выберите дату и время начала',
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled={formData.status === EventStatus.Started}
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500",
                      formData.status === EventStatus.Started && "bg-muted"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPp", { locale: ru })
                    ) : (
                      <span>Выберите дату и время</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => {
                        if (date) {
                          const hours = formData.startDate ? formData.startDate.getHours() : 12
                          const minutes = formData.startDate ? formData.startDate.getMinutes() : 0

                          const newDate = new Date(date)
                          newDate.setHours(hours)
                          newDate.setMinutes(minutes)

                          handleInputChange("startDate", newDate)
                        } else {
                          handleInputChange("startDate", date)
                        }
                      }}
                      initialFocus
                    />

                    <div className="border-t border-border p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Время</div>
                        <div className="flex space-x-2">
                          <select
                            className="w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
                            value={formData.startDate ? formData.startDate.getHours() : 12}
                            onChange={(e) => {
                              if (!formData.startDate) return

                              const newDate = new Date(formData.startDate)
                              newDate.setHours(Number.parseInt(e.target.value))
                              handleInputChange("startDate", newDate)
                            }}
                          >
                            {Array.from({ length: 24 }).map((_, i) => (
                              <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>

                          <span className="text-sm">:</span>

                          <select
                            className="w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
                            value={formData.startDate ? formData.startDate.getMinutes() : 0}
                            onChange={(e) => {
                              if (!formData.startDate) return

                              const newDate = new Date(formData.startDate)
                              newDate.setMinutes(Number.parseInt(e.target.value))
                              handleInputChange("startDate", newDate)
                            }}
                          >
                            {Array.from({ length: 60 }).map((_, i) => (
                              <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
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
                disabled={formData.status === EventStatus.Started}
                value={formData.endAddress || ''}
                onChange={(e) => handleInputChange('endAddress', e.target.value)}
                className={errors.endAddress ? 'border-red-500' : ''}
              />
            )}

            {renderFormField(
              'endDate',
              'Конец события',
              'Рассчитывается автоматически',
              <Input
                value={formData.endDate ? format(formData.endDate, "PPp", { locale: ru }) : ''}
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
            {[...Array(5)].map((_, index) => {
              
              const hasImage = imagePreviewUrls[index]

              return (
                <div
                    key={index}
                    className={cn(
                      "aspect-square rounded-lg border-2 relative overflow-hidden group",
                      hasImage 
                        ? "border-primary bg-primary/10"
                        : "border-dashed border-muted hover:border-primary/50 cursor-pointer transition-colors",
                    )}
                    onClick={() => !hasImage && handleImageClick(index)}
                    >
                    <input
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageSelect(index, e)}
                    />

                    {hasImage ? (
                      <>
                          <img
                              src={imagePreviewUrls[index] || "/placeholder.svg"}
                              alt={`Uploaded ${index + 1}`}
                              className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveImage(index)
                                }}
                              >
                                Удалить
                              </Button>
                          </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                </div>
              )
          })}
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
            {isEditMode ? "Сохранить изменения" : "Создать событие"}
          </Button>
        </div>
      </form>
    </div>
  )
}
