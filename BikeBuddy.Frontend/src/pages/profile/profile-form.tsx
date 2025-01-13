"use client"

import { useState, useCallback } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, Loader2, AlertCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ValidationService } from "@/core/services/ValidationService"
import { profileSchema } from "@/core/validations/profile"

const defaultValues = {
  email: "user@example.com",
  username: "user123",
  lastName: "Иванов",
  firstName: "Иван",
  middleName: "Иванович",
  birthDate: new Date("1990-01-01"),
  address: "г. Москва, ул. Примерная, д. 1",
}

const validationService = new ValidationService(profileSchema)

export default function ProfileForm() {
  const [formData, setFormData] = useState(defaultValues)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false)
  const [usernameChanged, setUsernameChanged] = useState(false)
  const [originalUsername] = useState(defaultValues.username)

  const validateField = useCallback(async (field: string, value: any) => {
    await validationService.validateField(field, value, setErrors)
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)

    if (field === 'username') {
      setUsernameChanged(value !== originalUsername)
    }
  }

  const handleUpdateUsername = async () => {
    setIsUpdatingUsername(true)
    
    const validateResult = await validationService.validateField('username', formData.username, setErrors)
    
    if (!validateResult) {
      setIsUpdatingUsername(false)
      return
    }

    try {
      // Здесь будет отправка username на сервер
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Updated username:", formData.username)
      setUsernameChanged(false)
    } catch (error) {
      console.error("Error updating username:", error)
    } finally {
      setIsUpdatingUsername(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    disabled?: boolean,
    showUpdateButton?: boolean
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            value={formData[name as keyof typeof formData]?.toString() || ''}
            onChange={(e) => handleInputChange(name, e.target.value)}
            disabled={disabled}
            className={cn(
              errors[name] ? 'pr-10 border-red-500' : 'pr-10',
              disabled && 'bg-muted'
            )}
          />
          {errors[name] ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors[name]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {showUpdateButton && usernameChanged && (
            <Button 
              type="button" 
              onClick={handleUpdateUsername}
              disabled={isUpdatingUsername}
              size="sm"
            >
              {isUpdatingUsername && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Обновить
            </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="w-full p-12">
      <form onSubmit={onSubmit} className="space-y-10">
        {/* Данные аккаунта */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Данные аккаунта</h3>
          <Separator />
          
          <div className="grid grid-cols-2 gap-6">
            {renderFormField('email', 'Email', 'Email нельзя изменить', true)}
            {renderFormField('username', 'Имя пользователя', 'От 3 до 20 символов', false, true)}
          </div>
        </div>

        {/* Личные данные */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Личные данные</h3>
          <Separator />

          <div className="grid grid-cols-3 gap-6">
            {renderFormField('lastName', 'Фамилия', 'Обязательное поле')}
            {renderFormField('firstName', 'Имя', 'Обязательное поле')}
            {renderFormField('middleName', 'Отчество', 'Необязательное поле')}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Дата рождения
              </label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !formData.birthDate && "text-muted-foreground",
                        errors.birthDate && "border-red-500"
                      )}
                    >
                      {formData.birthDate ? (
                        format(formData.birthDate, "PPP", { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                  <Calendar   
                    mode="single"
                    selected={formData.birthDate}
                    onSelect={(date) => handleInputChange('birthDate', date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    classNames={{
                      day_outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                    }}
                  />
                  </PopoverContent>
                </Popover>
                {errors.birthDate && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{errors.birthDate}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            {renderFormField('address', 'Адрес', 'Необязательное поле')}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Сохранить изменения
          </Button>
        </div>
      </form>
    </div>
  )
}