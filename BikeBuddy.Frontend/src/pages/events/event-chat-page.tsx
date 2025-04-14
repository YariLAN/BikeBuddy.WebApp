"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, Users, UserRound, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import * as signalR from "@microsoft/signalr"
import useAuthStore from "@/stores/auth"
import type { MessageDto, SendMessageRequest } from "@/core/models/event/chat-models"
import { decodeToken, getToken } from "@/core/services/JwtService"
import { LOCAL_BASE_URL } from "@/core/constants"

export default function EventChatPage() {
  const { eventId} = useParams<{ eventId: string}>()
  const location = useLocation()
  const chatId = location.state?.chatId;
  
  const navigate = useNavigate()

  const authStore = useAuthStore()
  
  const currentUser =  decodeToken()

  const [messages, setMessages] = useState<MessageDto[]>([])
  const [messageText, setMessageText] = useState("")
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Инициализация подключения к SignalR
  useEffect(() => {
    if (!chatId) {
      navigate(`/events/${eventId}`)
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${LOCAL_BASE_URL}hub/group-chat`, {
        accessTokenFactory: () => getToken() || "",
      })
      .withAutomaticReconnect()
      .build()

    connectionRef.current = connection

    // Обработчики событий
    connection.on("ReceiveMessage", (message: MessageDto) => {
      setMessages((prev) => [...prev, message])
      scrollToBottom()
    })

    connection.on("Error", (message: string) => {
      setError(message)
    })

    connection.on("UserJoined", (userId: string) => {
      setActiveUsers((prev) => [...prev, userId])
    })

    connection.on("UserLeft", (userId: string) => {
      setActiveUsers((prev) => prev.filter((id) => id !== userId))
    })

    connection.on("LoadMessages", (loadedMessages: MessageDto[]) => {
      setMessages(loadedMessages)
      scrollToBottom()
    })

    connection.on("ActiveUsersList", (users: string[]) => {
      console.log(users)
      setActiveUsers(users)
    })

    // Запуск подключения
    connection
      .start()
      .then(() => {
        setIsConnected(true)
        connection.invoke("JoinChat", chatId)
        connection.invoke("LoadMessages", chatId)
        connection.invoke("GetActiveUsers", chatId)
      })
      .catch((err) => {
        setError(`Ошибка подключения к чату: ${err.message}`)
      })

    window.addEventListener('beforeunload', async () => {
        connection
          .invoke("LeaveChat", chatId)
          .then(() => connection.stop())
    });

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection
          .invoke("LeaveChat", chatId)
          .then(() => connection.stop())
          .catch((err) => console.error("Ошибка при отключении от чата:", err))
      } else {
        connection.stop()
      }
    }
  }, [chatId, getToken()])

  // Функция для прокрутки к последнему сообщению
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  // Отправка сообщения
  const sendMessage = async () => {
    if (!messageText.trim() || !connectionRef.current || !chatId) return

    try {
      await connectionRef.current.invoke("SendMessages", {
        groupChatId: chatId,
        userId: currentUser!.nameId,
        content: messageText.trim(),
      } as SendMessageRequest )

      setMessageText("")
    } catch (error: any) {
      setError(`Ошибка отправки сообщения: ${error.message}`)
    }
  }

  // // Присоединение к чату (если пользователь еще не участник)
  // const joinChat = async () => {
  //   if (!eventId) return

  //   setIsJoining(true)
  //   try {
  //     const response = await apiService.post<boolean>(`/group-chats/${eventId}/join`, null, true)

  //     if (response.data) {
  //       // После успешного присоединения обновляем подключение
  //       if (connectionRef.current) {
  //         await connectionRef.current.invoke("JoinChat", eventId)
  //         await connectionRef.current.invoke("LoadMessages", eventId)
  //         await connectionRef.current.invoke("GetActiveUsers", eventId)
  //       }
  //     } else if (response.error) {
  //       setError(`Ошибка при присоединении к чату: ${response.error}`)
  //     }
  //   } catch (error: any) {
  //     setError(`Ошибка при присоединении к чату: ${error.message}`)
  //   } finally {
  //     setIsJoining(false)
  //   }
  // }

  // Форматирование времени сообщения
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "HH:mm", { locale: ru })
  }

  // Форматирование даты сообщения
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d MMMM", { locale: ru })
  }

  // Группировка сообщений по дате
  const groupedMessages = messages.reduce((groups: { [date: string]: MessageDto[] }, message) => {
    const date = formatMessageDate(message.createdAt)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={() => navigate(`/events/${eventId}`)} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад к событию
        </Button>
        <h1 className="text-3xl font-bold">Чат</h1>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{activeUsers.length} онлайн</span>
          </Badge>
        </div>
      </div>

      {/* {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Основной чат */}
        <div className="lg:col-span-3">
          <Card className="h-[70vh] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Сообщения</CardTitle>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <Badge variant="outline" className="bg-muted">
                      {date}
                    </Badge>
                  </div>

                  {dateMessages.map((message, index) => {
                    const isCurrentUser = message.userId === currentUser?.nameId

                    return (
                      <div
                        key={message.id || index}
                        className={cn("flex mb-4", isCurrentUser ? "justify-end" : "justify-start")}
                      >
                        <div className={cn("flex", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
                          <Avatar className={cn("h-8 w-8", isCurrentUser ? "ml-2" : "mr-2")}>
                            {/* message.userAvatar || ↓↓↓ */}
                            <AvatarImage src={ ""} />
                            <AvatarFallback>{message.userName?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>

                          <div>
                            <div
                              className={cn(
                                "max-w-md rounded-lg px-4 py-2",
                                isCurrentUser
                                  ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                                  : "bg-muted",
                              )}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{message.userName}</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-xs text-muted-foreground ml-2">
                                        {formatMessageTime(message.createdAt)}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{format(new Date(message.createdAt), "PPp", { locale: ru })}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <CardContent className="pt-3 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage()
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button type="submit" disabled={!isConnected || !messageText.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Отправить
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Список участников */}
        <div className="lg:col-span-1">
          <Card className="h-[70vh]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Участники онлайн
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(70vh-80px)]">
                {activeUsers.length > 0 ? (
                  <div className="space-y-3">
                    {activeUsers.map((userId) => (
                      <div key={userId} className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>
                            <UserRound className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          {userId === currentUser?.nameId ? "Вы" : `Участник`}
                          <div className="h-2 w-2 rounded-full bg-green-500 inline-block ml-2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">Нет активных участников</div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
