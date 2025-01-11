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
import { items, names } from "./menu-items"
import { Settings } from "lucide-react"

  const mainItems = items.filter(x => x.title != names.Setting)
  const settingItem = items[items.length-1]

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
                    {mainItems.map((item) => (
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
                    <SidebarMenuItem key={settingItem.title}>
                        <SidebarMenuButton asChild>
                            <a href={settingItem.url}>
                            <Settings></Settings>
                            <span>{settingItem.title}</span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    )
  }