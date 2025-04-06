'use client'

import { useCallback, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, LogIn, X } from 'lucide-react'
import * as yup from 'yup'
import { ValidationService } from '@/core/services/ValidationService';
import useAuthStore from '@/stores/auth'
import { useNavigate } from 'react-router-dom'

type LoginFormProps = { onClose: () => void; }

const schema = yup.object().shape({
  login: yup.string().required('Поле обязательно'),
  password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').required('Пароль обязателен'),
})
const validationService = new ValidationService(schema)

export default function LoginForm({ onClose }: LoginFormProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState<string | null>(null)

  const navigate = useNavigate()

  const authStore = useAuthStore()

  const validateField = useCallback(async (field: string, value: string) => {
    await validationService.validateField(field, value, setErrors)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginStatus(null)

    const validateResult = await validationService.validateForm({login, password })

    if (!validateResult.isValid) {
      setErrors(validateResult.errors)
      setIsLoading(false)
      return
    }

    try {
      await authStore.login(login, password)      
      setLoginStatus('Вход выполнен успешно!')
      
      onClose()
      navigate('/events')
    } catch (error : any) {
      setLoginStatus(`Ошибка: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log('Logging in with Google')
  }

  return (
    <TooltipProvider>
      <Card className="w-[380px]">
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
          <CardTitle>Авторизация</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="login">Логин</Label>
                <div className="relative">
                  <Input 
                    id="login" 
                    placeholder="Введите логин или email" 
                    value={login}
                    onChange={(e) => {
                      setLogin(e.target.value)
                      validateField('login', e.target.value)
                    }}
                    className={errors.login ? 'pr-10 border-red-500' : 'pr-10'}
                  />
                  {errors.login && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{errors.login}</p>
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
            {loginStatus && (
              <div className={`mt-4 p-2 rounded ${loginStatus.includes('успешно') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {loginStatus}
              </div>
            )}
            <CardFooter className="flex flex-col gap-4 mt-4 px-0">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Выполняется вход...' : 'Войти'}
              </Button>
              <Separator />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleLogin}
                className="w-full"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Войти через Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}