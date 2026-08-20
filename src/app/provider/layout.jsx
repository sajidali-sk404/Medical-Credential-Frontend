"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProviderSidebar } from "@/modules/provider-dashboard/ui/components/provider-sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function LayoutContent({ children }) {
  const { toggleSidebar, state, isMobile } = useSidebar();

  return (
    <>
      <div className="p-2 lg:hidden bg-white border-b">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {(state === "collapsed" || isMobile)
            ? <PanelLeftOpenIcon className="size-4" />
            : <PanelLeftCloseIcon className="size-4" />}
        </Button>
      </div>

      <ProviderSidebar>
        {children}
      </ProviderSidebar>
    </>
  );
}

export default function ProviderLayout({ children }) {
  const { user, loading, isProvider } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/sign-in"); return; }
    if (!isProvider) { router.replace(user.role === 'admin' ? "/admin/dashboard" : "/dashboard"); return; }
  }, [user, loading, isProvider]);

  if (loading || !user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: "#6b8b8b" }}>Loading Provider Portal...</p>
    </div>
  );

  if (!isProvider) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: "#6b8b8b" }}>Redirecting...</p>
    </div>
  );

  return (
    <SidebarProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}
