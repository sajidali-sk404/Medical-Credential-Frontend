"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, HelpCircle } from 'lucide-react'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DashboardUserButton } from "./dashboard-user-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const clientRoutes = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        icon: FileText,
        label: "My Requests",
        href: "/dashboard/requests",
    },
    {
        icon: HelpCircle,
        label: "Contact Support",
        href: "/dashboard/support",
    }
]

export const DashboardSidebar = ({ children }) => {
    const pathname = usePathname();
    return (
        <div className="flex h-screen w-full">
            <Sidebar>
                <SidebarHeader>
                    <h2>Dashboard</h2>
                </SidebarHeader>
                <div className="px-4 py-2">
                    <Separator className="opacity-50 text-[#5D6B68]" />
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {clientRoutes.map((item) =>
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/40 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/60 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50"
                                        )}>
                                            <Link href={item.href}>
                                                <item.icon className="size-5" />
                                                <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <div className="px-4 py-2">
                        <Separator className="opacity-50 text-[#5D6B68]" />
                    </div>
                </SidebarContent>
                <Link className="mb-3" href="/dashboard/new-request">
                    <Button className="w-full">+ New request</Button>
                </Link>
                <div className="px-4 py-2">
                    <Separator className="opacity-50 text-[#5D6B68]" />
                </div>
                <SidebarFooter>
                    <DashboardUserButton />
                </SidebarFooter>
            </Sidebar>
            {/* ✅ MAIN CONTENT (THIS WAS MISSING) */}
            <main className="flex-1 p-4 overflow-auto">
                {children}
            </main>
        </div >
    );
}