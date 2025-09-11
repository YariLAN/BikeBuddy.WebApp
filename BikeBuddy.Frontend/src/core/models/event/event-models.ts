export enum EventStatus {
	Opened = 0,
	Closed = 1,
    Started = 2,
	Completed = 3,
	Canceled = 4
}

export enum BicycleType {
    Default = 0,
    Road = 1,
    Mountain = 2,
    BMX = 3,
    Any = 4
}  

export enum EventType {
    Solo = 0,
    Group = 1,
    Race = 2,
    Leisure = 3,
    Training = 4,
    Challenge = 5,
    Tour = 6
}

export const bikeTypes = [
  { value: BicycleType.Default, label: "Городской" },
  { value: BicycleType.Road, label: "Шоссейный" },
  { value: BicycleType.Mountain, label: "Горный" },
  { value: BicycleType.BMX, label: "BMX" },
  { value: BicycleType.Any, label: "Любой" },
]

export const eventTypes = [
  { value: EventType.Solo, label: "Индивидуальный" },
  { value: EventType.Group, label: "Групповой" },
  { value: EventType.Leisure, label: "Прогулка" },
  { value: EventType.Race, label: "Веломарафон" },
  { value: EventType.Challenge, label: "Вызов" },
  { value: EventType.Training, label: "Тренировка" },
  { value: EventType.Tour, label: "Путешествие" },
]

export interface Marker {
    id : number,
    address: string,
    coordinates: [number, number]
} 

export interface Point {
    lat : string,
    lon : string
} 

export interface PointDetails {
    orderId : number,
    point : Point,
    address : string
}

///

export interface CreateEventRequest {
    name: string,
    description : string,
    type : EventType,
    bicycleType : BicycleType,
    countMembers : number,
    distance : number,
    startAddress : string,
    endAddress : string,
    startDate : Date,
    endDate : Date,
    userId : string,
    points : PointDetails[]
    status : EventStatus
}

export interface EventListResponse {
    eventId : string,
    name : string,
    description : string,
    type : EventType,
    bicycleType : BicycleType,
    countMembers : number,
    distance : number,
    startAddress : string,
    endAddress : string,
    startDate : Date,
    endDate : Date,
    nameAuthor : string,
    status : EventStatus,
    isCorfirmedByAuthor: boolean | null | undefined,
    imageUrl : string
} 

export interface EventResponse {
    eventId: string,
    name: string,
    description: string,
    type: EventType,
    bicycleType: BicycleType,
    countMembers: number,
    currentCountMembers: number,
    distance: number,
    startAddress: string,
    endAddress: string,
    isCorfirmedByAuthor: boolean | undefined | null,
    isPlannedFinished: boolean,
    startDate: Date,
    endDate: Date,
    chatId : string,
    author: UserResponse
    points: PointDetails[]
    status: EventStatus
}

export interface UserResponse {
    userID: string,
    userName: string,
    email: string,
    surname: string,
    name: string,
    middleName: string,
    birthDay: string,
    address: string,
    photoUrl: string,
}

export interface EventResponseDetails {
    event : EventResponse,
    canEdit : boolean,
    isMemberChat : boolean
}

///

export interface EventFilterDto {
    countMembers : number,
    startAddress : string,
    participantIds? : string[]
}

export interface UpdateEventRequest {
    name: string
    description: string
    type: EventType
    bicycleType: BicycleType
    countMembers: number
    distance: number
    startAddress: string
    endAddress: string
    startDate: Date
    endDate: Date
    points: PointDetails[]
  }

///