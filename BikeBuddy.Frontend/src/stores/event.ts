import { ApiResponse, apiService } from "@/core/services/ApiService";
import { create } from "zustand";


interface EventState {
    uploadMap: (eventId : string, file : FormData) => Promise<ApiResponse<string>>;
}

const useEventStore = create<EventState>(
    () => ({
        uploadMap: async (eventId : string, file : FormData) => {
            let result = await apiService.file_post<string>(`/file/${eventId}/upload-route`, file, true);
            return result
        }
    })
)

export default useEventStore;