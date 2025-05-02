"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, Loader2, AlertCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import useProfileStore, { UserProfileResponse } from "@/stores/profile"
import JwtService from "@/core/services/JwtService"
import { alertExpectedError, alertInfo } from "@/core/helpers"
import { getFormData, mapFormDataToRequest } from "@/core/mappers/profile-mapper"
import { ApiResponse } from "@/core/services/ApiService"
import '@geoapify/geocoder-autocomplete/styles/round-borders.css';
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';

interface ProfileDataProps {
  profile : UserProfileResponse,
}

const validationService = new ValidationService(profileSchema)

export default function ProfileForm({ profile } : ProfileDataProps) {
  const userData = JwtService.decodeToken()

  const [formData, setFormData] = useState(getFormData(userData!, profile))
  
  useEffect(() => {
    setFormData(getFormData(userData!, profile))

    setAvatarUrl(profile.avatarUrl ?? "")
  }, [profile])

  const apiKey = import.meta.env.VITE_NEXT_PUBLIC_GEOAPIFY_API_KEY

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false)
  const [usernameChanged, setUsernameChanged] = useState(false)
  const [originalUsername] = useState(userData?.name)

  const [filePhoto, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const profileStore = useProfileStore()

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
    
    const validateResult = await validationService.validateField('username', formData.username || "", setErrors)
    
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
      let result : ApiResponse<boolean>
      if (profile.id.length <= 0) {
        result = await profileStore.createProfile(userData!.nameId, mapFormDataToRequest(formData))
      }
      else {
        result = await profileStore.updateProfile(userData!.nameId, mapFormDataToRequest(formData))
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      if (result!.data) {
        alertInfo("", "Данные профиля успешно сохранены", 'success')
      }
      else if (result.error) { alertExpectedError(result.error)}
    } 
    finally {
      setIsSubmitting(false)
    }

    if (filePhoto) {
      setIsUploadingAvatar(true)
      try {
        const url = await profileStore.uploadAvatar(userData!.nameId, filePhoto);
        
        if (url.data) {
          setAvatarUrl(url.data)
          return () => URL.revokeObjectURL(url.data!)
        }
        else if (url.error) {
          alertExpectedError(url.error)
        }
      } catch (error : any) {
        alertExpectedError(error.message)
      } finally {
        setIsUploadingAvatar(false)
      }
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setAvatarUrl(objectUrl)
    setAvatarFile(file)

    return () => URL.revokeObjectURL(objectUrl)
  }

  function suggestionsFilter(suggestions : any[]) {
    const processedCity = [];

    const filtered = suggestions.filter(value => {
      if (!value.properties.city) {
        return false;
      } else {
        processedCity.push(value.properties.street);
        return true;
      }
    })

    return filtered;
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const renderFormField = (
    name: string,
    label: string,
    tooltip: string,
    disabled?: boolean,
    showUpdateButton?: boolean,
    placeholder? : string,
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
            placeholder={placeholder}
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
    <div className="w-full p-16">
      <form onSubmit={onSubmit} className="space-y-10">

        {/* Аватар */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Фото профиля</h3>
          <Separator />

          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-48 w-48">
                <AvatarImage src={avatarUrl} alt="Фото профиля" className="object-cover"/>
                <AvatarFallback>{formData.username!.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-48"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  Изменить фото
                </Button>
                <div>
                  <span className="text-xs text-muted-foreground">
                    JPG, PNG или GIF. Максимум 2MB.
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isUploadingAvatar}
                />
              </div>            
              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-secondary"
                  onClick={() =>{ 
                    setAvatarUrl(""); 
                    setAvatarFile(null)
                    if (fileInputRef.current) {fileInputRef.current.value = "";}
                  }}>
                  Удалить фото
                </Button>
              )}
            </div>
          </div>
        </div>

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
            {renderFormField('middleName', 'Отчество', 'Необязательное поле', false, false, "при наличие")}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                        <AlertCircle className="h-4 w-4 text-red-500 absolute right-9 top-1/2 transform -translate-y-1/2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{errors.birthDate}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <div className="mt-8">
              <GeoapifyContext
                className="bg-white"
                apiKey={apiKey}>
                  <GeoapifyGeocoderAutocomplete
                    lang="ru"
                    placeholder="Введите адрес здесь"
                    value={formData.address}    
                    onUserInput={(value) => {formData.address = value}}            
                    placeSelect={(value) => {
                      formData.address =`${value.properties.city}, ${value.properties.country}`;
                    }} 
                    postprocessHook={(value) => {
                      return `${value.properties.city}, ${value.properties.country}`; 
                    }}
                    suggestionsFilter={suggestionsFilter}
                  />
              </GeoapifyContext>
            </div>

          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit"
            variant="ghost"
            className="text-secondary"
            disabled={isSubmitting}>
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