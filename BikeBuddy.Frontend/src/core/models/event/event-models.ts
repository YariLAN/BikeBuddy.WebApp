export enum EventStatus {
	Opened = 0,
	Closed = 1,
	Completed = 2,
	Canceled = 3
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
    imageUrl : string
} 

export interface EventResponse {
    eventId: string,
    name: string,
    description: string,
    type: EventType,
    bicycleType: BicycleType,
    countMembers: number,
    distance: number,
    startAddress: string,
    endAddress: string,
    startDate: Date,
    endDate: Date,
    author: UserResponse
    points: PointDetails[]
    status: EventStatus
}

export interface UserResponse {
    userName: string,
    email: string,
    surname: string,
    name: string,
    middleName: string,
    birthDay: string,
    address: string
}

export interface EventResponseDetails {
    event : EventResponse,
    canEdit : boolean,
    isMemberChat : boolean
}

///

export interface EventFilterDto {
    countMembers : number
}

///