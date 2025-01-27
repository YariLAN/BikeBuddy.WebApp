import { ApiResponse, apiService } from "@/core/services/ApiService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfileResponse {
    id : string,
    surname : string,
    name : string,
    middleName : string,
    birthDay? : Date,
    address? : string
}

export interface UserProfileRequest {
    userId : string,
    surname : string,
    name : string,
    middleName : string,
    birthDay? : Date,
    address? : string
}

export interface Address {
    country : string,
    city : string
}

interface ProfileState {
    isProfileFilled: boolean;
    getProfile: (userId: string) => Promise<ApiResponse<UserProfileResponse>>;
    createProfile: (request : UserProfileRequest) => Promise<ApiResponse<boolean>>;
    updateProfile: (request : UserProfileRequest) => Promise<ApiResponse<boolean>>;
}

const useProfileStore = create(
    persist<ProfileState>(
        (set) => ({
            isProfileFilled: false,
            getProfile: async (userId : string) => {
                let result = await apiService.get<UserProfileResponse>(`/profile/${userId}`)   
                
                set({ isProfileFilled : !result.error})
                return result
            },
            createProfile: async (request : UserProfileRequest) => {
                let result = await apiService.post<boolean>(`/profile/${request.userId}`, request, true)

                if (result.data) { set({isProfileFilled : true})}
                return result
            },
            updateProfile : async (request : UserProfileRequest) => {
                let result = await apiService.put<boolean>(`/profile/${request.userId}`, request)
                return result
            }
        }),
        {
            name: "profile-storage"
        }
    )
)
export default useProfileStore
