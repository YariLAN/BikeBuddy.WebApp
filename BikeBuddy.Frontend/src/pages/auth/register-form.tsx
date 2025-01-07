'use client'

import { useCallback, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, X } from "lucide-react"
import * as yup from 'yup'
import { ValidationService } from '@/core/services/ValidationService'

type RegsiterProps = { onClose: () => void; }

const schema = yup.object().shape({
  email: yup.string().email('Неверный формат email').required('Email обязателен'),
  username: yup.string().min(3, 'Логин пользователя должке содержать минимум 3 символа').required('Логин пользователя обязателен'),
  password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').required('Пароль обязателен'),
})
const validationService = new ValidationService(schema)

export default function RegisterForm({ onClose }: RegsiterProps) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateField = useCallback(async (field: string, value: string) => {
    await validationService.validateField(field, value, setErrors)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validateResult = await validationService.validateForm({ email, username, password })

    if (!validateResult.isValid) {
      setErrors(validateResult.errors)
      return
    }

    try {
      // Здесь будет логика отправки данных на сервер
      console.log('Registration data:', { email, username, password })
      setErrors({})
    } catch (error) {

    }
  }

  return (
    <TooltipProvider>
      <Card className="w-[350px]">
        <CardHeader className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onClose}
            >
            <X className="h-4 w-4" />
            <span className="sr-only">Закрыть</span>
          </Button>
          <CardTitle>Регистрация</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      validateField('email', e.target.value)
                    }}
                    className={errors.email ? 'pr-10 border-red-500' : 'pr-10'}
                  />
                  {errors.email && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{errors.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Имя пользователя</Label>
                <div className="relative">
                  <Input 
                    id="username" 
                    placeholder="Логин" 
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      validateField('username', e.target.value)
                    }}
                    className={errors.username ? 'pr-10 border-red-500' : 'pr-10'}
                  />
                  {errors.username && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{errors.username}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      validateField('password', e.target.value)
                    }}
                    className={errors.password ? 'pr-10 border-red-500' : 'pr-10'}
                  />
                  {errors.password && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{errors.password}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-between mt-4 px-0">
              <Button type="submit">Зарегистрироваться</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}