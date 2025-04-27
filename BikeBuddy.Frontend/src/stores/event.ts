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
    updateEvent: (eventId: string, event: UpdateEventRequest) => Promise<ApiResponse<boolean>>
}

const useEventStore = create<EventState>(
    () => ({
        uploadMap: async (eventId : string, fileBlob : Blob) => {
            var formFile = convertBlobToFormData(fileBlob, "map.png")

            let result = await apiService.file_post<string>(`/file/${eventId}/upload-route`, formFile, true);
            return result
        },
        createEvent: async (event: CreateEventRequest) => {
            let result = await apiService.post<string>('/events/create', event, true);
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
        }
    })
)

export default useEventStore;