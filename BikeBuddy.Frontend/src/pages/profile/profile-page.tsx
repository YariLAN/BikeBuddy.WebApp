import { useNavigate, useParams } from "react-router-dom";
import ProfileForm from "./profile-form";
import { useEffect } from "react";
import JwtService from "@/core/services/JwtService";

interface ProfilePageProps {
    userId?: string
}

export default function ProfilePage( {userId: propsUserId } :ProfilePageProps) {
    const { userId: paramsUserId } = useParams()
    const navigate = useNavigate()
    const userId = propsUserId || paramsUserId

    useEffect(() => {
        // Проверяем, что пользователь смотрит свой профиль
        const decoded = JwtService.decodeToken()
        if (!decoded?.nameId || decoded.nameId !== userId) {
          navigate('/')
        }
    }, [userId, navigate]) 

    return (
        <div className="container py-10">
            <ProfileForm />
        </div>
    )
}