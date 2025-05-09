"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {  Bell, LogOut, MessageCirclePlus, MessageSquare, UserPen, } from 'lucide-react'
import { useEffect, useState } from "react"
import LoginForm from "./auth/login-form"
import RegisterForm from "./auth/register-form"
import useAuthStore from "@/stores/auth"
import Swal from "sweetalert2"
import { useNavigate } from 'react-router-dom'
import JwtService from "@/core/services/JwtService"
import { alertError } from "@/core/helpers"
import useProfileStore from "@/stores/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const [isOpenLoginForm, setIsOpenLoginForm] = useState(false)
  const [isOpenRegisterForm, setIsOpenRegisterForm] = useState(false)
  
  const navigate = useNavigate()

  const hasNotifications = false;

  const currentProfile = useProfileStore((state) => state.currentProfile)
  const avatarUrl = currentProfile?.avatarUrl || ""

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authStore.isAuthenticated) {
        const decoded = JwtService.decodeToken()

        if (decoded?.nameId) {
          try {
            await profileStore.getProfile(decoded.nameId)
          } catch (error: any) {
            alertError(error.message)
          }
        }
      }
    }

    fetchUserProfile()
  }, [authStore.isAuthenticated])
  
  const handleProfileClick = async () => {
    const decoded = JwtService.decodeToken()
    if (decoded?.nameId) {
      navigate(`/profile/${decoded.nameId}`)

    } else (error: any) => {
      console.error('User ID not found in token')
      alertError(error)
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: "Вы действительно хотите выйти?",
      showConfirmButton: true,
      showCancelButton: true,
      icon: "question",
      confirmButtonText: "Подтвердить",
      cancelButtonText: "Отмена",
      width: 450,
      customClass: {
        confirmButton: "btn btn-danger",
        popup: "swal-alert-info"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        authStore.logout()
        navigate('/')
      }
    });
  }

  const getInitials = () => {
    const name = JwtService.decodeToken()?.name
    if (!name) return "U"
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div>
      <header className="border-b">
        <div className="flex h-16 items-center px-4 justify-end gap-4">
          {authStore.isAuthenticated ? (
            <>
              <button className="mr-4 bg-white relative">
                <Bell className="h-4 w-4"/>
                
                { hasNotifications && (
                  <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              

              { JwtService.decodeToken()!.name }

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="User avatar" className="object-cover" />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    
                    {/* { hasNotifications && (
                      <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )} */}
                  </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => handleProfileClick()}>
                    <UserPen className="mr-2 h-4 w-4" />
                    <span className="flex items-center">
                      Профиль
                      {hasNotifications && (
                        <span
                          className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500"
                          title="Есть уведомления"
                        ></span>
                      )}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button onClick={() => setIsOpenLoginForm(true)}>Войти</Button>
              <Button onClick={() => setIsOpenRegisterForm(true)}>Регистрация</Button>
            </>
          )}
        </div>
      </header>

      {isOpenLoginForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded shadow-lg box">
            <LoginForm onClose={() => setIsOpenLoginForm(false)}/>
          </div>
        </div>
      )}

      {isOpenRegisterForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded shadow box">
            <RegisterForm onClose={() => setIsOpenRegisterForm(false)}/>
          </div>
        </div>
      )}
    </div>
  )
}