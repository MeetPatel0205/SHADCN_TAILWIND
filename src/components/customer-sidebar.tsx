import * as React from "react"
import {
  LifeBuoy,
  Send,
  SquareTerminal,
  Command
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/context/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Customer",
    email: "customer@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "My Account",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Orders",
          url: "#",
        },
        {
          title: "Address Book",
          url: "#",
        },
      ],
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
      items: [
        {
          title: "Contact Us",
          url: "#",
        },
        {
          title: "FAQs",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function CustomerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Fallback if user is not loaded (though protected route should handle this)
  const userData = user ? {
    name: user.name || "Customer",
    email: user.email || "customer@example.com",
    avatar: user.avatar || "/avatars/shadcn.jpg"
  } : data.user;

  return (
    <Sidebar
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Customer Portal</span>
                  <span className="truncate text-xs">My Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} logoutRedirect="/customer/login" />
      </SidebarFooter>
    </Sidebar>
  )
}
