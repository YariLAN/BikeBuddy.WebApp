export interface NotificationResponse {
    id : string,
    message : string,
    type : MessageType,
    isRead : boolean,
    url : string,
    createdAt : Date
}

export enum MessageType {
   Info = 0
}