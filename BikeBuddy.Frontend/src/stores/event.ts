import { CreateEventRequest, EventFilterDto, EventListResponse, EventResponseDetails, UpdateEventRequest } from "@/core/models/event/event-models";
import { ApiResponse, apiService } from "@/core/services/ApiService";
import { convertBlobToFormData } from "@/lib/utils";
import { create } from "zustand";
import { PageData, SearchFilterDto } from "./search_types";

interface EventState {
    uploadMap: (eventId : string, fileBlob : Blob) => Promise<ApiResponse<string>>;
    createEvent: (event: CreateEventRequest) => Promise<ApiResponse<string>>;
    getEvents: (filter: SearchFilterDto<EventFilterDto>) => Promise<ApiResponse<PageData<EventListResponse>>>;
    getEventById: (eventId: string) => Promise<ApiResponse<EventResponseDetails>>;
    cancelEventById: (eventId: string) => Promise<ApiResponse<boolean>>;
    updateEvent: (eventId: string, event: UpdateEventRequest) => Promise<ApiResponse<boolean>>;
    confirmEvent : (eventId: string) => Promise<ApiResponse<boolean>>;
    confirmFinishEvent : (eventId: string) => Promise<ApiResponse<boolean>>;
}

const useEventStore = create<EventState>(
    () => ({
        uploadMap: async (eventId : string, fileBlob : Blob) => {
            var formFile = convertBlobToFormData(fileBlob, "map.png")

            let result = await apiService.file_post<string>(`/file/${eventId}/upload-route`, formFile, true);
            return result
        },
        createEvent: async (event: CreateEventRequest) => {

            const formData = new FormData();

            formData.append("Name", event.name);
            formData.append("Description", event.description);
            formData.append("Type", event.type.toString());
            formData.append("BicycleType", event.bicycleType.toString());
            formData.append("CountMembers", event.countMembers.toString());
            formData.append("Distance", event.distance.toString());
            formData.append("StartAddress", event.startAddress);
            formData.append("EndAddress", event.endAddress);
            formData.append("StartDate", event.startDate.toISOString());
            formData.append("EndDate", event.endDate.toISOString());
            formData.append("UserId", event.userId);
            formData.append("Status", event.status.toString());

            // Добавляем Points как JSON
            formData.append("Points", JSON.stringify(event.points));

            // Добавляем файлы
            if (event.files && event.files.length > 0) {
                event.files.forEach((file, index) => {
                    formData.append("Files", file);
                });
            }

            let result = await apiService.post<string>('/events/create', formData, true, { headers: { 
                'Content-Type' : 'multipart/form-data',
            }});
            return result
        },
        getEvents: async (filter: SearchFilterDto<EventFilterDto>) => {
            let result = await apiService.post<PageData<EventListResponse>>('/events/', filter, true)
            return result
        },
        getEventById: async (eventId: string) => {
            const result = await apiService.get<EventResponseDetails>(`/events/${eventId}`)
            return result
        },
        cancelEventById: async (eventId: string) => {
            const result = await apiService.delete<boolean>(`/events/${eventId}`)
            return result
        },
        updateEvent: async (eventId: string, event: UpdateEventRequest) => {
            const result = await apiService.put<boolean>(`/events/${eventId}`, event);
            return result;
        },
        confirmEvent: async (eventId : string) => {
            const result = await apiService.post<boolean>(`/events/${eventId}/confirm`, {}, true);
            return result;
        },
        confirmFinishEvent: async (eventId : string) => {
            const result = await apiService.post<boolean>(`/events/${eventId}/finish`, {}, true);
            return result
        }
    })
)

export default useEventStore;