import { NextConfig } from "next";

import dotenv from "dotenv";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

export const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
    dotenv.config({ path: ".env.production" });
} else {
    dotenv.config({ path: ".env.development" });
}

const allowedDevOriginsString = process.env.ALLOWED_DEV_ORIGINS;
const allowedDevOrigins =
    typeof allowedDevOriginsString === "string"
        ? allowedDevOriginsString.split(",")
        : ["127.0.0.1", "localhost"];

const nextConfig: NextConfig = {
    allowedDevOrigins: allowedDevOrigins,
    reactStrictMode: true,
    poweredByHeader: false,
    // trailingSlash: false,
    compress: false,
    skipTrailingSlashRedirect: true,
    output: "standalone",
    compiler: {
        styledComponents: true,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "src", "styles")],
    },

    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
        ];
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
