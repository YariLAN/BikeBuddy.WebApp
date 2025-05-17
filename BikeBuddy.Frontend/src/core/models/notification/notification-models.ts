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
   Info = 0
}

export const SweetAlertType : Record<MessageType, SweetAlertIcon> =  {
    [MessageType.Info] : 'info'
}

export enum TypeTitle {
    ConfirmEvent = "Подтвердите заезд"
}
