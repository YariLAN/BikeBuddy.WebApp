"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from 'lucide-react'
import { useState } from "react"
import LoginForm from "./auth/login-form"
import RegisterForm from "./auth/register-form"

// Временно для демонстрации
const isAuthenticated = false

export function Header() {
  const [isOpenLoginForm, setIsOpenLoginForm] = useState(false)
  const [isOpenRegisterForm, setIsOpenRegisterForm] = useState(false)

  return (
    <div>
      <header className="border-b">
        <div className="flex h-16 items-center px-4 justify-end gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <img
                    className="rounded-full"
                    src="/placeholder.svg?height=32&width=32"
                    alt="User avatar"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Профиль</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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