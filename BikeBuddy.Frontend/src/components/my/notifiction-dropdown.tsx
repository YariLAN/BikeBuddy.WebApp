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
import { NotificationResponse } from "@/core/models/notification/notification-models"

interface NotificationDropdownProps {
  notifications: NotificationResponse[]
  hasUnread: boolean
  onMarkAllAsRead: () => void
  onNotificationClick: (notification: NotificationResponse) => void
}

export function NotificationDropdown({
  notifications,
  hasUnread,
  onMarkAllAsRead,
  onNotificationClick,
}: NotificationDropdownProps) {
  const formatNotificationTime = (date: Date) => {
    try {
      return format(date, "d MMM HH:mm", { locale: ru })
    } catch (e) {
      return date.toDateString()
    }
  }

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
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Уведомления</span>
          {notifications.length > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onMarkAllAsRead()
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
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start py-2 px-4 cursor-pointer",
                  !notification.isRead && "bg-muted/50",
                )}
                onClick={() => onNotificationClick(notification)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">{notification.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                {!notification.isRead && <span className="w-2 h-2 rounded-full bg-primary mt-1"></span>}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
