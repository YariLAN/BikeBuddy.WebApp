import { Marker, Point, PointDetails } from "../models/event/event-models";

// Преобразование Marker в Point
const markerToPoint = (marker: Marker): Point => ({
    lat: marker.coordinates[0].toString(),
    lon: marker.coordinates[1].toString(),
});

export const markerToPointDetails = (marker: Marker) : PointDetails => ({
    orderId: marker.id,
    address: marker.address,
    point: markerToPoint(marker)
})