import { ApiResponse, apiService } from "@/core/services/ApiService";
import { create } from "zustand";

interface ChatState {
    registerInChat: (chatId : string) => Promise<ApiResponse<boolean>>;
}

const useChatStore = create<ChatState>(
    () => ({
        registerInChat: async (chatId : string) => {
            let result = await apiService.post<boolean>(`/group-chats/${chatId}/join`, true);
            return result
        },
    })
)

export default useChatStore;