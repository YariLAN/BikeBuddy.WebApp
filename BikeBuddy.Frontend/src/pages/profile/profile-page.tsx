import { useNavigate, useParams } from "react-router-dom";
import ProfileForm from "./profile-form";
import { useEffect } from "react";
import JwtService from "@/core/services/JwtService";
import useProfileStore from "@/stores/profile";
import { alertInfo } from "@/core/helpers";

interface ProfilePageProps {
    userId?: string
}

export default function ProfilePage( {userId: propsUserId } :ProfilePageProps) {
    const { userId: paramsUserId } = useParams()
    const navigate = useNavigate()
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
                    alertInfo("Данных профиля нет", "Заполните поля", "warning")
                }
            }
        }   
        
        profileData()
    }, [userId, navigate]) 

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="bg-background rounded-lg shadow">
                <ProfileForm />
            </div>
        </div>
    )
}