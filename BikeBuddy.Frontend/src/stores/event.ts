import { CreateEventRequest } from "@/core/models/event-models";
import { ApiResponse, apiService } from "@/core/services/ApiService";
import { convertBlobToFormData } from "@/lib/utils";
import { create } from "zustand";

interface EventState {
    uploadMap: (eventId : string, fileBlob : Blob) => Promise<ApiResponse<string>>;
    createEvent: (event: CreateEventRequest) => Promise<ApiResponse<string>>;
}

const useEventStore = create<EventState>(
    () => ({
        uploadMap: async (eventId : string, fileBlob : Blob) => {
            var formFile = convertBlobToFormData(fileBlob, "map.png")

            let result = await apiService.file_post<string>(`/file/${eventId}/upload-route`, formFile, true);
            return result
        },
        createEvent: async (event: CreateEventRequest) => {
            let result = await apiService.post<string>('/events/', event, true);
            return result
        }
    })
)

export default useEventStore;