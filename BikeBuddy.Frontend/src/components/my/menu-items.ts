import { Bike, Mails,  PersonStandingIcon, Search, Settings, Ticket, Users, } from "lucide-react"
   
export const names = {
    Setting: "Настройки"
}

// Menu items.
export const items = [
  {
    title: "События",
    url: "#",
    icon: Ticket,
  },
  {
    title: "История поездок",
    url: "#",
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
