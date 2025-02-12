import { UserProfileRequest, UserProfileResponse } from "@/stores/profile";
import { TokenPayload } from "../services/JwtService";

export const mapFormDataToRequest = (data: any) : UserProfileRequest => ({
  surname: data.lastName,
  name: data.firstName,
  middleName: data.middleName,
  birthDay: data.birthDate,
  address: data.address || undefined
});

export const getFormData = (userData : TokenPayload, profile : UserProfileResponse) => ({
  email: userData?.email || "",
  username: userData?.name || "",
  lastName: profile.surname || "",
  firstName: profile.name || "",
  middleName: profile.middleName || "",
  birthDate: profile.birthDay,
  address: profile.address || ""
})