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
    Lat : string,
    Lon : string
} 

// Преобразование Marker в Point
export const markerToPoint = (marker: Marker): Point => ({
    Lat: marker.coordinates[0].toString(),
    Lon: marker.coordinates[1].toString(),
});