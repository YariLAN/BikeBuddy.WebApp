import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
   
// Menu items.
const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ]

  export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader style={{ backgroundColor: "#A1FFDC" }} />
          <SidebarGroup style={{ backgroundColor: "#A1FFDC" }}>
            <SidebarGroupLabel className="text-lg">Sidebar</SidebarGroupLabel>
          </SidebarGroup>
        <SidebarContent 
          style={{backgroundColor: "#c4ffe9"}}>
          <SidebarGroup>
          <SidebarGroupLabel>Главная</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu >
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter style={{ backgroundColor: "#c4ffe9" }}>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem key={items[items.length-1].title}>
                        <SidebarMenuButton asChild>
                            <a href={items[items.length-1].url}>
                            <span>{items[items.length-1].title}</span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    )
  }