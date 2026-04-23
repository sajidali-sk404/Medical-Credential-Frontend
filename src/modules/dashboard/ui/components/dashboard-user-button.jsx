
import { useAuth } from "../../../../../context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarGenerated } from "@/components/avatar-generated";
import { ChevronDown, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const isMobile = useIsMobile();
    const handleLogout = () => {
        logout();
        router.push("/sign-in");
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                    {user.image ? (
                        <Avatar>
                            <AvatarImage src={user?.image} />
                        </Avatar>
                    ) : <AvatarGenerated seed={user.name} variant="initials" className="size-9 mr-3" />}
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full">
                            {user.name}
                        </p>
                        <p className="text-xs truncate w-full">
                            {user.email}
                        </p>
                    </div>
                    <ChevronDown className="size-4 shrink-0" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {user.name}
                        </DrawerTitle>
                        <DrawerDescription>
                            {user.email}
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button variant="outline" onClick={() => { }}>
                            <CreditCardIcon className="size-4 mr-2" />
                            Billing</Button>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOutIcon className="size-4 mr-2" />
                            Log Out
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                {user?.image ? (
                    <Avatar>
                        <AvatarImage src={user?.image} />
                    </Avatar>
                ) : <AvatarGenerated seed={user?.name} variant="initials" className="size-9 mr-3" />}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">
                        {user?.name}
                    </p>
                    <p className="text-xs truncate w-full">
                        {user?.email}
                    </p>
                </div>
                <ChevronDown className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium truncate">{user?.name}</span>
                        <span className="text-xs font-normal text-muted-foreground truncate">{user?.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center justify-center">
                    Billing
                    <CreditCardIcon className="size-4 " />
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center justify-center" onClick={handleLogout}>
                    LogOut
                    <LogOutIcon className="size-4 " />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );


}