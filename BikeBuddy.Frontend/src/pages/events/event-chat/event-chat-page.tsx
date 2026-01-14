"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, Users, UserRound, Calendar, RouteIcon, MapPin, Bike, Flag, User, Mail, Cake, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import * as signalR from "@microsoft/signalr"
import type { MessageDto, SendMessageRequest } from "@/core/models/event/chat-models"
import { decodeToken, getToken } from "@/core/services/JwtService"
import { LOCAL_BASE_URL } from "@/core/constants"
import { BicycleType, bikeTypes, EventResponse, EventStatus, EventType, eventTypes } from "@/core/models/event/event-models"
import useEventStore from "@/stores/event"
import { alertExpectedError } from "@/core/helpers"
import { Separator } from "@/components/ui/separator"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import Picker from 'emoji-picker-react';
import { UserResponse } from "@/core/models/user-models"

export default function EventChatPage() {
  const { eventId} = useParams<{ eventId: string}>()
  const location = useLocation()
  const chatId = location.state?.chatId;
  
  const navigate = useNavigate()
  const eventStore = useEventStore()
  const currentUser =  decodeToken()

  const [messages, setMessages] = useState<MessageDto[]>([])
  const [messageText, setMessageText] = useState("")
  const [activeUsers, setActiveUsers] = useState<UserResponse[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [eventDetails, setEventDetails] = useState<EventResponse | null>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)

  const [showPicker, setIsShowEmojiPicker] = useState<string | null>(null)

  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!eventId) return

    const fetchEventDetails = async () => {
      setIsLoadingEvent(true)
      try {
        const result = await eventStore.getEventById(eventId)
        if (result.data) {
          setEventDetails(result.data.event)
        } else if (result.error) {
          alertExpectedError(`Ошибка загрузки информации о событии: ${result.error}`)
        }
      } catch (error: any) {
        alertExpectedError(`Ошибка загрузки информации о событии: ${error.message}`)
      } finally {
        setIsLoadingEvent(false)
      }
    }

    fetchEventDetails()
  }, [eventId, eventStore])

  // SignalR
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

    connection.on("UserJoined", (user: UserResponse) => {
      setActiveUsers((prev) => [...prev, user])
    })

    connection.on("UserLeft", (userId: string) => {
      setActiveUsers((prev) => prev.filter((user) => user.userID !== userId))
    })

    connection.on("LoadMessages", (loadedMessages: MessageDto[]) => {
      setMessages(loadedMessages)
      scrollToBottom()
    })

    connection.on("ActiveUsersList", (users: UserResponse[]) => {
      setActiveUsers(users)
    })

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

  // Форматирование даты события
  const formatEventDate = (dateString: Date) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: ru })
  }

  // Форматирование времени события
  const formatEventTime = (dateString: Date) => {
    return format(new Date(dateString), "HH:mm", { locale: ru })
  }

  // Форматирование даты рождения
  const formatBirthday = (dateString: string | undefined) => {
    try {
      return formatMessageDate(dateString!)
    } catch (e) {
      return "Не указано"
    }
  }

  const getFullName = (user: UserResponse): string => {
    if (user.name && user.surname) {
      return `${user.name} ${user.surname}${user.middleName ? ` ${user.middleName}` : ""}`
    }
    return user.userName
  }

  // Получение названия типа велосипеда
  const getBikeTypeLabel = (bicycleType: BicycleType): string => {
    const type = bikeTypes.find((t) => t.value === bicycleType)
    return type ? type.label : "Неизвестный"
  }

  // Получение названия типа события
  const getEventTypeLabel = (eventType: EventType): string => {
    const type = eventTypes.find((t) => t.value === eventType)
    return type ? type.label : "Неизвестный"
  }

  // сообщения по дате
  const groupedMessages = messages.reduce((groups: { [date: string]: MessageDto[] }, message) => {
    const date = formatMessageDate(message.createdAt)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  const isCancel = eventDetails?.status === EventStatus.Canceled

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={() => navigate(`/events/${eventId}`)} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад к событию
        </Button>
        <h1 className="text-3xl font-bold">Чат</h1>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 bg-slate-200 text-slate-900">
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

      {/* Информация о маршруте */}
      {isLoadingEvent ? (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="animate-pulse flex flex-col gap-2">
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : eventDetails ? (
       <div className="relative">
          <Card className={cn("mb-6", isCancel ? "bg-red-50" : "bg-green-50")}>
            <CardHeader>
              <CardTitle>{eventDetails.name}</CardTitle>
              <CardDescription className="line-clamp-2">{eventDetails.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <div>
                      <div className="text-xs text-muted-foreground">Дата и время</div>
                      <div className="text-sm">
                        {formatEventDate(eventDetails.startDate)} в {formatEventTime(eventDetails.startDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <RouteIcon className="mr-2 h-4 w-4" />
                    <div>
                      <div className="text-xs text-muted-foreground">Дистанция</div>
                      <div className="text-sm">{eventDetails.distance / 1000} км</div>
                    </div>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <div>
                      <div className="text-xs text-muted-foreground">Старт</div>
                      <div className="text-sm truncate max-w-[200px]" title={eventDetails.startAddress}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex-1 text-sm truncate">{`${eventDetails.startAddress}` || "Загрузка адреса..."}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{`${eventDetails.startAddress}`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <div>
                      <div className="text-xs text-muted-foreground">Финиш</div>
                      <div className="text-sm truncate max-w-[200px]" title={eventDetails.endAddress}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex-1 text-sm truncate">{`${eventDetails.endAddress}` || "Загрузка адреса..."}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{`${eventDetails.endAddress}`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Оверлэй */}
              {eventDetails.status === EventStatus.Canceled && (
                <div className="absolute flex items-center justify-center z-10 backdrop-blur-[1px] top-0 left-0 right-0 bottom-0"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-500">ОТМЕНЕНО</h3>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <Bike className="h-3 w-3 mr-1" />
                    {getBikeTypeLabel(eventDetails.bicycleType)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    <Flag className="h-3 w-3 mr-1" />
                    {getEventTypeLabel(eventDetails.type)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 bg-red-200 text-red-900">
                  <Users className="h-3 w-3 mr-1" />
                  {eventDetails.countMembers} участников
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Основной чат */}
        <div className="lg:col-span-3">
          <Card className="h-[70vh] flex flex-col">
            <CardHeader className="pb-3 bg-green-50">
              <CardTitle>Сообщения</CardTitle>
            </CardHeader>

            <ScrollArea className="flex-1 p-4 ">
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
                            <AvatarImage src={message.photoUrl || ""} />
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
                              <p className="whitespace-pre-wrap break-words">
                                {message.content}

                                {/* <Button 
                                  onClick={() => setIsShowEmojiPicker(showPicker === message.id ? null : message.id)}
                                  className="bg-green-50 ml-3"
                                />

                                {showPicker === message.id && (
                                  <div className="emoji-picker-wrapper">
                                    <Picker
                                      skinTonesDisabled={true}
                                      reactionsDefaultOpen={true}
                                      onEmojiClick={(e) => console.log(e)}
                                      open={showPicker === message.id}
                                    />
                                  </div>
                                )} */}
                                
                              </p>
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

            <CardContent className="pt-3 border-t bg-green-50">
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
                  disabled={!isConnected || isCancel}
                  className="flex-1 bg-white"
                />
                <Button type="submit" disabled={!isConnected || !messageText.trim() || isCancel}>
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
            <CardHeader className="pb-3 bg-green-50">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Участники онлайн
              </CardTitle>
            </CardHeader>
            <CardContent>
            <ScrollArea className="h-[calc(60vh-80px)]  mt-2">
                {activeUsers.length > 0 ? (
                  <div className="">
                    {activeUsers.map((user) => (
                      <HoverCard key={user.userID}>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center cursor-pointer hover:bg-muted/50 p-2 transition-colors">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={user.photoUrl ?? ""} className="object-cover"/>
                              <AvatarFallback>
                                <UserRound className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <div className="font-medium">
                                {user.userID === currentUser?.nameId ? "Вы" : user.userName}
                              </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 ml-2"></div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="text-lg">
                                {user.name ? user.name.charAt(0) : user.userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                              <h4 className="text-sm font-semibold">
                                {getFullName(user)}
                              </h4>
                              <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="h-3.5 w-3.5" />
                                  <span>{user.userName}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Mail className="h-3.5 w-3.5" />
                                  <span>{user.email}</span>
                                </div>
                                {user.birthDay && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <Cake className="h-3.5 w-3.5" />
                                    <span>{formatBirthday(user.birthDay)}</span>
                                  </div>
                                )}
                                {user.address && (
                                  <div className="flex items-center gap-2">
                                    <Home className="h-3.5 w-3.5" />
                                    <span className="truncate">{user.address}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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
