"use client";

import { LuChevronDown } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages, languagesKeymap } from "@/config";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function LanguageSwitcher({
    className,
    defaultLocale,
}: {
    className?: string;
    defaultLocale: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const currentLanguage = languagesKeymap[defaultLocale];

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none focus:outline-none" asChild>
                <Button
                    className={cn(
                        "group flex items-center space-x-2 px-3 py-1 rounded-md border outline-none focus:outline-none",
                        "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition",
                        className,
                    )}
                    size="default"
                    variant="ghost"
                >
                    <div className="flex items-center space-x-2">
                        {/*<div className="size-5 rounded-full overflow-hidden bg-secondary flex items-center justify-center">*/}
                        <currentLanguage.Icon className="size-8" />
                        {/*</div>*/}
                        {/*<span className="font-medium text-sm">{currentLanguage.label}</span>*/}
                        <LuChevronDown className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-md py-1 space-y-1"
            >
                {languages.map(item => (
                    <DropdownMenuItem
                        key={item.value}
                        onClick={() => handleLanguageChange(item.value)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md",
                            "hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer",
                            item.value === currentLanguage.value &&
                                "font-semibold bg-gray-100 dark:bg-gray-800",
                        )}
                    >
                        <item.Icon className="size-6" />

                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LanguageSwitcher;
