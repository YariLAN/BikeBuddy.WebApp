import { SweetAlertIcon } from "sweetalert2"

export interface NotificationResponse {
    id : string,
    title: string,
    message : string,
    type : MessageType,
    isRead : boolean,
    url : string,
    createdAt : Date
}

export enum MessageType {
   Info = 0,
   Warning = 1,
   Success = 2,
   Question = 3,
}

export const SweetAlertType : Record<MessageType, SweetAlertIcon> =  {
    [MessageType.Info] : 'info',
    [MessageType.Warning] : 'warning',
    [MessageType.Success] : 'success',
    [MessageType.Question] : 'question'
}

export enum TypeTitle {
    ConfirmEvent = "Подтвердите заезд",
    AutoConfirmStart = "Заезд стартовал",
    ConfirmFinish = "Подтвердите завершение заезда",
    RepeatConfirmFinish = "Повторное напоминание"
}

export const getNotificationColor = (type: MessageType): string => {
    switch (type) {
        case MessageType.Info:
            return "bg-blue-500"
        case MessageType.Warning:
            return "bg-orange-500"
        case MessageType.Success:
            return "bg-green-500"
        case MessageType.Question:
            return "bg-primary"
    }
}

export const getNotificationBgColor = (type: MessageType, isRead: boolean): string => {
  if (isRead) return ""

  switch (type) {
    case MessageType.Info:
      return "bg-blue-50 dark:bg-blue-900/10"
    case MessageType.Warning:
      return "bg-yellow-50 dark:bg-yellow-900/10"
    case MessageType.Success:
      return "bg-green-50 dark:bg-green-900/10"
    case MessageType.Question:
      return "bg-muted/50"
  }
}
