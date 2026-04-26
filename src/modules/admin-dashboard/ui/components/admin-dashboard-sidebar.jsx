"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, ShieldQuestionMark, Users } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../../lib/utils";
import { DashboardUserButton } from "../../../dashboard/ui/components/dashboard-user-button";
import { Separator } from "../../../../components/ui/separator";


const adminRoutes = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/admin/dashboard",
    },
    {
        icon: Users,
        label: "Clients",
        href: "/admin/clients",
    },
    {
        icon: FileText,
        label: "All Requests",
        href: "/admin/requests",
    },
    {
        icon: ShieldQuestionMark,
        label: "Contact Support",
        href: "/admin/support",
    }
]
export const AdminDashboardSidebar = ({ children }) => {
    const pathname = usePathname();
    return (
        <div className="flex h-screen w-full">
            <Sidebar>
                <SidebarHeader>
                    <h2>Admin Portal</h2>
                </SidebarHeader>
                <div className="px-4 py-2">
                    <Separator className="opacity-50 text-[#5D6B68]" />
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {adminRoutes.map((item) =>
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/40 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathname === item.href && "bg-linear-to-r/increasing border-[#5D6B68]/60 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50"
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
                </SidebarContent>
                <div className="px-4 py-2">
                    <Separator className="opacity-50 text-[#5D6B68]" />
                </div>
                <SidebarFooter>
                    <DashboardUserButton />
                </SidebarFooter>
            </Sidebar>
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}