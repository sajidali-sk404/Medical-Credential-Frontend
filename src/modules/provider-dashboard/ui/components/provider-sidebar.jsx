"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, FolderKanban, User, HelpCircle, Stethoscope } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";
import { Separator } from "@/components/ui/separator";

const providerRoutes = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/provider/dashboard",
    },
    {
        icon: FileText,
        label: "Verification Requests",
        href: "/provider/requests",
    },
    {
        icon: FolderKanban,
        label: "My Documents",
        href: "/provider/documents",
    },
    {
        icon: User,
        label: "Provider Profile",
        href: "/provider/profile",
    },
    {
        icon: HelpCircle,
        label: "Support & Help",
        href: "/provider/support",
    }
];

export const ProviderSidebar = ({ children }) => {
    const pathname = usePathname();
    return (
        <div className="flex h-screen w-full">
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-[#1D9E75] flex items-center justify-center">
                            <Stethoscope className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-[15px] tracking-[-0.01em] leading-tight">
                                CredFlow
                            </span>
                            <span className="text-[10px] text-teal-400 font-medium">Provider Portal</span>
                        </div>
                    </div>
                </SidebarHeader>
                <div className="px-4 py-2">
                    <Separator className="opacity-50 text-[#5D6B68]" />
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {providerRoutes.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/40 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            (pathname === item.href || pathname.startsWith(`${item.href}/`)) && "bg-linear-to-r/oklch border-[#5D6B68]/60 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50"
                                        )}>
                                            <Link href={item.href}>
                                                <item.icon className="size-5 text-teal-400" />
                                                <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
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
            <main className="flex-1 p-4 md:p-6 overflow-auto bg-slate-50/50">
                {children}
            </main>
        </div>
    );
};
