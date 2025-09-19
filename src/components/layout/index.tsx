import { ReactNode } from "react";

import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";

export default function DefaultLayout({ children }: { children?: ReactNode; title?: ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />

                <SidebarInset className="max-h-full overflow-auto">
                    <header className="z-100 bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <div className="ml-auto">
                            <LocaleSwitcher />
                        </div>
                    </header>
                    <div className="w-full flex flex-1 flex-col gap-4">{children}</div>
                </SidebarInset>
        </SidebarProvider>
    );
}
