import * as React from "react"
import {
    Command,
    LifeBuoy,
    Send,
    SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
    projects: [], // Empty for customer
}

import { CustomerSidebar } from "@/components/customer-sidebar"

export function CustomerDashboard() {
    return (
        <SidebarProvider>
            <CustomerSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Account
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Overview</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
