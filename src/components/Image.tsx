"use client";

import { useState, useEffect, useMemo, memo } from "react";

import NextImage, { ImageProps as BaseImageProps } from "next/image";

import { MEDIA_HOST } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Generate shimmer SVG
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <defs>
    <linearGradient id="g">
      <stop offset="0%" stop-color="#f6f7f8" />
      <stop offset="50%" stop-color="#edeef1" />
      <stop offset="100%" stop-color="#f6f7f8" />
    </linearGradient>
    <clipPath id="clip">
      <rect x="0" y="0" width="${w}" height="${h}" rx="12" ry="12" />
    </clipPath>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" fill="#f6f7f8" clip-path="url(#clip)" />
  <rect x="-${w}" y="0" width="${w}" height="${h}" fill="url(#g)" clip-path="url(#clip)">
    <animate attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite" />
  </rect>
</svg>
`;

// Convert string to Base64 (client/server safe)
const toBase64 = (str: string) =>
    typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

// Props interface extending Next.js ImageProps
export interface ImageProps extends Omit<BaseImageProps, "src"> {
    src?: string | null;
    fallbackSrc?: string;
    darkFallbackSrc?: string;
    isServerImage?: boolean;
    enablePlaceholder?: boolean;
    withBackground?: boolean;
}

const Image = memo(
    ({
        src,
        fallbackSrc = "/1x1-image-light.png",
        placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcP2d9PQAGdwJ74VxCZwAAAABJRU5ErkJggg==",

        enablePlaceholder = true,
        width,
        height,
        isServerImage = false,
        fill,
        className = "",
        withBackground = false,
        ...props
    }: ImageProps) => {
        const [imgSrc, setImgSrc] = useState<string | null>(fallbackSrc);
        const [loading, setLoading] = useState(true);
        const [retryCount, setRetryCount] = useState(0);
        const imgWidth = useMemo(() => {
            return typeof width === "string" ? parseInt(width) : (width ?? 500);
        }, [width]);
        const imgHeight = useMemo(() => {
            return typeof height === "string" ? parseInt(height) : (height ?? 500);
        }, [height]);

        const shimmerPlaceholder = useMemo(() => {
            if (!placeholder && enablePlaceholder && imgWidth && imgHeight) {
                return `data:image/svg+xml;base64,${toBase64(shimmer(imgWidth, imgHeight))}`;
            }
            return placeholder;
        }, [placeholder, imgWidth, imgHeight, enablePlaceholder]);

        useEffect(() => {
            const isSrcValid = typeof src === "string" && src.trim() !== "";
            const themeFallbackSrc = fallbackSrc;
            if (!isSrcValid) {
                setImgSrc(themeFallbackSrc);
                return;
            } else if (!isServerImage) {
                setImgSrc(src);
                return;
            }

            const finalSrc = src.trim();

            const hasSchema = /^[a-z][a-z\d+\-.]*:\/\//i.test(finalSrc);
            const isAbsolutePath = finalSrc.startsWith("/");

            if (hasSchema) {
                // Full URL — leave as-is
                setImgSrc(finalSrc);
            } else if (isAbsolutePath) {
                // Path like "/media/img.png" — prepend domain
                setImgSrc(`${MEDIA_HOST}${finalSrc}`);
            } else {
                // Path like "media/img.png" or "uploads/image.jpg"
                setImgSrc(`${MEDIA_HOST}/${finalSrc}`);
            }
        }, [src, fallbackSrc, isServerImage]);
        return (
            <div
                className={cn(
                    "relative",
                    fill && "w-full h-full",
                    withBackground && "bg-accent/70",
                    className,
                )}
                style={{ overflow: "hidden" }}
            >
                {loading && enablePlaceholder && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(data:${shimmerPlaceholder})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            filter: "brightness(1.1)",
                            zIndex: 1,
                        }}
                        className="animate-pulse"
                        aria-hidden="true"
                    />
                )}
                <NextImage
                    {...props}
                    src={imgSrc ?? fallbackSrc}
                    width={fill ? undefined : width}
                    height={fill ? undefined : height}
                    fill={fill}
                    placeholder="empty" // disable Next.js blur so it doesn’t conflict
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        const themeFallbackSrc = fallbackSrc;
                        setImgSrc(themeFallbackSrc);
                        setLoading(false);

                        if (retryCount === 0 && src) {
                            setRetryCount(1);
                            setTimeout(() => {
                                setImgSrc(imgSrc); // re-request
                                setLoading(true);
                            }, 3000);
                        }
                    }}
                    className={`transition-opacity duration-300 ${
                        loading ? "opacity-0" : "opacity-100"
                    } ${className ?? ""}`}
                />
            </div>
        );
    },
);

Image.displayName = "Image";
export default Image;
