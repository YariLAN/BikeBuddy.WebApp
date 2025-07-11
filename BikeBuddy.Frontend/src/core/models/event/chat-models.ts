export interface MessageDto {
    id: string
    groupChatId: string
    userId: string
    userName: string
    content: string
    createdAt: string,
    photoUrl: string
  }
  
  export interface SendMessageRequest {
    groupChatId: string
    userId: string
    content: string
  }