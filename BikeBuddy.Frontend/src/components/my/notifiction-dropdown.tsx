"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { getNotificationBgColor, getNotificationColor, NotificationResponse, SweetAlertType, TypeTitle } from "@/core/models/notification/notification-models"
import useAuthStore from "@/stores/auth"
import useNotificationStore from "@/stores/notification"
import { useEffect, useRef, useState } from "react"
import { LOCAL_BASE_URL } from "@/core/constants"
import * as signalR from "@microsoft/signalr"
import JwtService from "@/core/services/JwtService"
import { alertError, alertExpectedError, alertWithAction, toastAlert } from "@/core/helpers"
import useEventStore from "@/stores/event"
import { useNavigate } from "react-router-dom"

export function NotificationDropdown() {

  const authStore = useAuthStore()
  const eventStore = useEventStore()
  const notificationStore = useNotificationStore() 

  const notificationConnectionRef = useRef<signalR.HubConnection | null>(null)
  const [hasUnread, setHasNotifications] = useState(false)
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])

  const navigate = useNavigate()

  const formatNotificationTime = (date: Date) => {
    try {
      return format(date, "d MMM HH:mm", { locale: ru })
    } catch (e) {
      return date.toDateString()
    }
  }

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      setNotifications([])
      setHasNotifications(false)
      return
    };

    if (!notificationConnectionRef.current) {
      
      notificationConnectionRef.current = new signalR.HubConnectionBuilder()
        .withUrl(`${LOCAL_BASE_URL}hub/notifications`, {
          accessTokenFactory: () => JwtService.getToken() || "",
        })
        .withAutomaticReconnect()
        .build()
          
      notificationConnectionRef.current.on("ReceiveNotification", (notification : NotificationResponse) => {
        console.log(notification);

        setNotifications( (prev) => [ notification, ...prev])
        setHasNotifications(true)
      })

      notificationConnectionRef.current
        .start()
        .then(() => {
          notificationConnectionRef.current!.invoke("ConnectedAsync")
        })
        .catch((err) => {
          console.error("Ошибка подключения к хабу:", err)
        });

      window.addEventListener("beforeunload", async () => {
        try {
          await notificationConnectionRef.current!.stop();
        } catch (err) {
          console.error("Ошибка отключения от хаба: ", err)
        }
      });
      
      window.addEventListener('popstate', async () => {
        try {
          await notificationConnectionRef.current!.stop();
        } catch (err) {
          console.error("Ошибка отключения от хаба: ", err)
        }
      });

      return () => {
        if (notificationConnectionRef.current!.state === signalR.HubConnectionState.Connected) {
          notificationConnectionRef.current!
            .stop()
            .then(() => {
              console.log("Отключение от хаба")
              notificationConnectionRef.current = null
            })
            .catch((err) => console.error("Ошибка отключения от хаба: ", err))
        }
      }
    }
  }, [authStore.isAuthenticated])

  const handleMarkAllAsRead = async () => {
    try {
      const result = await notificationStore.markAllNotificationsAsRead() 
       
      if (result.data) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setHasNotifications(false)
      }
    } catch (error : any) {
      alertExpectedError(error.message)
    }
  }

  const cancelEvent = async (id : string) => {
    try {
      const result = await eventStore.cancelEventById(id)
    
      if (result.data) {
        toastAlert("", "Заезд успешно отменен", 'success', 'center')
      } else if (result.error) {
        alertExpectedError(result.error)
      }
    } catch (error : any) {
      alertExpectedError(error.message)
    }
  }

  const markNotificationAsRead = async (id: string) => {
    try {
      const result = await notificationStore.markNotificationAsRead(id) 
       
      if (result.data) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: result.data! } : n)))
        setHasNotifications(notifications.every(n => !n.isRead))
      }
    } catch (error : any) {
      alertExpectedError(error.message)
    }
  }

  const handleNotificationClick = async (notification: NotificationResponse) => {
    await markNotificationAsRead(notification.id)
   
    const msg = `<div class="notification"><p class="notification-message">${notification.message}</p> 
      <span id="navigate-link" style="color: #069; cursor: pointer; text-decoration: underline">Перейти к заезду</span></div>
    `
    const type = SweetAlertType[notification.type]

    if (notification.title == TypeTitle.ConfirmEvent) {
      let alert = alertWithAction(
        notification.title, msg, notification.url, type,"", "Закрыть", "Отменить заезд", navigate
      )

      alert.then(async (result) => {
        if (result.isDenied) {
          const id = notification.url.split('/')[1];
          await cancelEvent(id)
        }
      });
    }
    else if (notification.title == TypeTitle.AutoConfirmStart) {
      alertWithAction(notification.title, msg, notification.url, type, "", "Закрыть", "", navigate, 360)
    }
    else if (notification.title == TypeTitle.ConfirmFinish) {
      let alert = alertWithAction(notification.title, msg, notification.url, type, "", "Закрыть", "", navigate)

      alert.then(async (result) => {
        
      })
    }
    else if (notification.title.includes(TypeTitle.RepeatConfirmFinish)) {
      alertWithAction(notification.title, msg, notification.url, type, "", "Закрыть", "", navigate)
    }
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      if (authStore.isAuthenticated) {
        try {
          const result = await notificationStore.getNotificationsByUser()

          if (result.data) {
            setNotifications(result.data.body)
            setHasNotifications(result.data.body.some((n) => !n.isRead))
          } else if (result.error) {
            alertExpectedError(result.error)
          }
        } catch (error: any) {
          alertError(error.message)
        }
      }
    }

    fetchNotifications()
  }, [authStore.isAuthenticated])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative bg-white" aria-label="Уведомления">
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[470px]">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Уведомления</span>
          {notifications.length > 0 && hasUnread && (
            <button
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                await handleMarkAllAsRead()
              }}
              className="text-right text-xs hover:underline bg-white"
            >
              Отметить все как прочитанные
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 px-2 text-center text-muted-foreground">Уведомления отсутствуют</div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start py-2 px-2 cursor-pointer",
                    // !notification.isRead && "bg-muted/50",
                    getNotificationBgColor(notification.type, notification.isRead),
                  )}
                  onClick={async () => await handleNotificationClick(notification)}
                >
                  <div className="flex w-full gap-2 px-0.5">
                    {!notification.isRead && (
                      <span className={cn("flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-5", getNotificationColor(notification.type))}>
                      </span>
                    )}

                    <div className="flex-1 flex flex-col px-1">       
                      <div className="flex justify-between w-full">
                        <span className="font-medium">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
