import { ApiResponse, apiService } from "@/core/services/ApiService";
import { convertFileToFormData } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfileResponse {
    id : string,
    surname : string,
    name : string,
    middleName : string,
    birthDay? : Date,
    address? : string,
    avatarUrl: string
}

export interface UserProfileRequest {
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
    currentProfile: UserProfileResponse | null;
    getProfile: (userId: string) => Promise<ApiResponse<UserProfileResponse>>;
    createProfile: (userId : string, request : UserProfileRequest) => Promise<ApiResponse<boolean>>;
    updateProfile: (userId : string, request : UserProfileRequest) => Promise<ApiResponse<boolean>>;
    uploadAvatar: (userId: string, file: File) => Promise<ApiResponse<string>>;
}

const useProfileStore = create(
    persist<ProfileState>(
        (set, get) => ({
            isProfileFilled: false,
            currentProfile: null,
            getProfile: async (userId : string) => {
                let result = await apiService.get<UserProfileResponse>(`/profile/${userId}`)   
                
                set({ isProfileFilled : !result.error, currentProfile: result?.data})

                return result
            },
            createProfile: async (userId : string, request : UserProfileRequest) => {
                let result = await apiService.post<boolean>(`/profile/${userId}`, request, true)

                if (result.data) { 
                    set({isProfileFilled : true})
                    await get().getProfile(userId)
                }
                
                return result
            },
            updateProfile : async (userId : string, request : UserProfileRequest) => {
                let result = await apiService.put<boolean>(`/profile/${userId}`, request)

                if (result.data) {
                    await get().getProfile(userId)
                }

                return result
            },
            uploadAvatar: async (userId: string, file: File) => {
                let formData = convertFileToFormData(file);
                const result = await apiService.file_post<string>(`/file/${userId}/upload-avatar`, formData, true)

                if (result.data && get().currentProfile) {
                    set({
                      currentProfile: {
                        ...get().currentProfile!,
                        avatarUrl: result.data,
                      },
                    })
                }

                return result;
            }
        }),
        {
            name: "profile-storage",
            partialize: (state) => ({
              isProfileFilled: state.isProfileFilled,
              currentProfile: state.currentProfile,
              getProfile: state.getProfile,
              createProfile: state.createProfile,
              updateProfile: state.updateProfile,
              uploadAvatar: state.uploadAvatar,
            }),
        }
    )
)
export default useProfileStore
