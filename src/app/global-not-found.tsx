import type { Metadata } from "next";


// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.
export const metadata: Metadata = {
    title: "Not Found",
    description: "The page you are looking for does not exist.",
};
export default function GlobalNotFound() {
    return (
        <html lang="en">
            <body>
                <div>
                    <h1>Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                </div>
            </body>
        </html>
    );
}
