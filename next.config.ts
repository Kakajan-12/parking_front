import {NextConfig} from "next";

import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const defaultAllowedDevOrigins = ["127.0.0.1", "localhost"];
const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS;
if (allowedDevOrigins) {
    const origins = allowedDevOrigins.split(",");
    origins.forEach(origin => {
        defaultAllowedDevOrigins.push(origin);
    })
}

const nextConfig: NextConfig = {
    allowedDevOrigins: defaultAllowedDevOrigins,
    reactStrictMode: true,
    poweredByHeader: false,
    // trailingSlash: false,
    compress: false,
    skipTrailingSlashRedirect: true,
    // output: 'standalone',
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
            {
                source: "/notification-sw.js",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/javascript; charset=utf-8",
                    },
                    {
                        key: "Cache-Control",
                        value: "no-cache, no-store, must-revalidate",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self'",
                    },
                ],
            },
        ];
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

