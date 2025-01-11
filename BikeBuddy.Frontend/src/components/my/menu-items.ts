import { Bike, Inbox,  PersonStandingIcon, Search, Settings, Ticket } from "lucide-react"
   
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
    icon: Inbox,
  },
  {
    title: "Друзья",
    url: "#",
    icon: PersonStandingIcon,
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
