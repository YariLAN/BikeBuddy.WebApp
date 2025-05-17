import { NotificationResponse } from "@/core/models/notification/notification-models";
import { PageData } from "./search_types";
import { ApiResponse, apiService } from "@/core/services/ApiService";
import { create } from "zustand";


interface NotificationState {
    getNotificationsByUser: () => Promise<ApiResponse<PageData<NotificationResponse>>>,
    markNotificationAsRead: (notificationId : string) => Promise<ApiResponse<boolean>>,
    markAllNotificationsAsRead: () => Promise<ApiResponse<boolean>>,
}

const useNotificationStore = create<NotificationState>(
    () => ({
        getNotificationsByUser: async () => {
            let result = await apiService.get<PageData<NotificationResponse>>("/notifications/")

            return result
        },
        markNotificationAsRead: async (notificationId : string) => {
            let result = await apiService.post<boolean>(`/notifications/${notificationId}/read`, {}, true)
            return result
        },
        markAllNotificationsAsRead: async () => {
            let result = await apiService.post<boolean>("/notifications/read", {}, true)
            return result 
        }
    })
)

export default useNotificationStore;