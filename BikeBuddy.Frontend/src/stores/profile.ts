import { ApiResponse, apiService } from "@/core/services/ApiService";
import { create } from "zustand";

export interface UserProfileResponse {
    id : string,
    surname : string,
    name : string,
    middleName : string,
    birthDay? : Date,
    address : Address
}

export interface Address {
    country : string,
    city : string
}

interface ProfileState {
    getProfile: (userId: string) => Promise<ApiResponse<UserProfileResponse>>;
}

const useProfileStore = create<ProfileState>(
    (set) => ({
        getProfile: async (userId : string) => {
            return await apiService.get<UserProfileResponse>(`/profile/${userId}`)     
        },
    })
)
export default useProfileStore
