"use client"

import { Button } from "@/components/ui/button"
import EventForm from "@/modules/CreateOrEditEventForm/components/EventForm"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"


export default function CreateEventPage() {
  const navigate = useNavigate()
  
  const { eventId } = useParams<{ eventId: string}>()
  const isEditMode = !!eventId

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="flex items-center mb-8">
        <Button variant='outline' onClick={() => isEditMode ? navigate(`/events/${eventId}`) : navigate("/events")} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold ml-6">{isEditMode ? "Редактирование заезда" : "Создание заезда"}</h1>
      </div>
      
      <EventForm isEditMode={isEditMode} eventId={eventId} />
    </div>
  )
}
