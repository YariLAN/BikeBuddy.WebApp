import { useNavigate, useParams } from "react-router-dom";
import ProfileForm from "./profile-form";
import { useEffect, useState } from "react";
import JwtService from "@/core/services/JwtService";
import useProfileStore, { UserProfileResponse } from "@/stores/profile";
import { Warning } from "@/components/my/warning";
import { alertExpectedError } from "@/core/helpers";

interface ProfilePageProps {
    userId?: string
}

const defaultProfile: UserProfileResponse = {
    id : '',
    surname : '',
    name : '',
    middleName : '',
}

export default function ProfilePage( {userId: propsUserId } : ProfilePageProps) {
    const { userId: paramsUserId } = useParams()
    const navigate = useNavigate()
    const [profileDetails, setProfileDetails] = useState<UserProfileResponse>(defaultProfile)

    const profileStore = useProfileStore()
    const userId = propsUserId || paramsUserId

    useEffect(() => {
        // Проверяем, что пользователь смотрит свой профиль
        const profileData = async () => {
            const decoded = JwtService.decodeToken()
            if (!decoded?.nameId || decoded.nameId !== userId) {
              navigate('/')
            }
            else {
                let pr = await profileStore.getProfile(decoded.nameId)
                if (pr.error) {
                    alertExpectedError(pr.error)
                } else {
                    setProfileDetails(pr.data!)
                }
            }
        }   
        
        profileData()
    }, [userId, navigate]) 


    return (
        <div className="container mx-auto px-4 py-10">
            <div className="bg-background rounded-lg shadow">
                <div className="px-8 pt-3">{!profileStore.isProfileFilled && <Warning />}</div>
                <ProfileForm profile={ profileDetails } />
            </div>
        </div>
    )
}