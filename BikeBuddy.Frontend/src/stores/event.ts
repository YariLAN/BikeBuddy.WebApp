import { CreateEventRequest, EventFilterDto, EventListResponse, EventResponseDetails, UpdateEventRequest } from "@/core/models/event/event-models";
import { ApiResponse, apiService } from "@/core/services/ApiService";
import { convertBlobToFormData } from "@/lib/utils";
import { create } from "zustand";
import { PageData, SearchFilterDto } from "./search_types";
import { serialize } from 'object-to-formdata';

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
            const formData = serialize(event, {
                indices: true,
                noFilesWithArrayNotation: true,
            });

            let result = await apiService.file_post<string>('/events/create', formData, true);
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