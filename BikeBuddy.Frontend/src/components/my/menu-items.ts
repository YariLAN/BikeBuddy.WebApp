import { Bike, Mails, Search, Settings, Ticket, Users, } from "lucide-react"
   
export const names = {
    Events: "События",
    History: "История поездок",
    Setting: "Настройки"
}

// Menu items.
export const items = [
  {
    title: names.Events,
    url: "/events",
    icon: Ticket,
  },
  {
    title: names.History,
    url: "/events/history",
    icon: Bike,
  },
  {
    title: "Чаты",
    url: "#",
    icon: Mails,
  },
  {
    title: "Друзья",
    url: "#",
    icon: Users,
  },
  {
    title: "Поиск",
    url: "#",
    icon: Search,
  },
  {
    title: names.Setting,
    url: "#",
    icon: Settings,
  },
]
