"use client";

import * as React from "react";

import { X } from "lucide-react";

import Image from "@/components/Image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ImageLightboxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    src: string;
    alt: string;
    caption?: string;
}

const ImageLightbox = ({ open, onOpenChange, src, alt, caption }: ImageLightboxProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex flex-col items-center justify-center bg-black/90 p-0 sm:p-0 border-0">
                <DialogClose
                    className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </DialogClose>
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src={src}
                        alt={alt}
                        width={1200}
                        height={800}
                        className={cn(
                            "max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-200 ease-in-out select-none",
                        )}
                        draggable={false}
                        priority
                    />
                    {caption && (
                        <p className="mt-2 text-sm text-muted-foreground text-center max-w-[80vw]">
                            {caption}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageLightbox;
