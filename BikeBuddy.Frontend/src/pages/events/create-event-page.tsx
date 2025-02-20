"use client"

import { useState } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RouteMap } from "@/components/my/map/map"
import { RouteMapContainer } from "@/components/my/map/route-map-container"

const validationService = new ValidationService(eventSchema)

const bikeTypes = [
  { value: 'road', label: 'Шоссейный' },
  { value: 'mtb', label: 'Горный' },
  { value: 'hybrid', label: 'Гибрид' },
  { value: 'any', label: 'Любой' },
]

export default function CreateEventPage() {
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    title: '',
    description: '',
    startAddress: '',
    endAddress: '',
    startDateTime: undefined,
    endDateTime: undefined,
    distance: undefined,
    bikeType: undefined,
    images: [],
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
      // Здесь будет отправка данных на сервер
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
    tooltip: string,
    component: React.ReactNode
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">
        {label}
      </label>
      <div className="relative">
        {component}
        {errors[name] && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={cn(
              "min-h-[150px]",
              errors.description && "border-red-500"
            )}
          />
        )}

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

        {/* Дистанция и тип велосипеда */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {renderFormField(
            'bikeType',
            'Тип велосипеда',
            'Выберите рекомендуемый тип велосипеда',
            <Select
              value={formData.bikeType}
              onValueChange={(value) => handleInputChange('bikeType', value)}
            >
              <SelectTrigger className={errors.bikeType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Выберите тип велосипеда" />
              </SelectTrigger>
              <SelectContent>
                {bikeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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