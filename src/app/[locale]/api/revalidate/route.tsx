import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get("path");
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const tag = request.nextUrl.searchParams.get("tag");
    let message = "Missing revalidate params"
    let revalidated = false;
    // Revalidate the path if provided
    if (path) {
        revalidatePath(path);
        message = `Path ${path} revalidated`;
        revalidated = true
    }else if (tag){
        revalidateTag(tag);
        message = `Tag ${tag} revalidated`;
        revalidated = true
    }

    // Handle redirect logic
    if (redirectParam === "false") {
        // Don't redirect if redirect=false
        return NextResponse.json({
            revalidated: !!path,
            now: Date.now(),
            message: path ? `Path ${path} revalidated` : "Missing path to revalidate"
        });
    } else if (redirectParam === "pass") {
        // Redirect to the provided path if it exists and redirect=pass
        if (path) {
            return NextResponse.redirect(new URL(path, request.url));
        }
        // If no path provided but redirect=pass, redirect to root
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Default behavior (when redirect is not specified or is invalid)
    return NextResponse.json({
        revalidated: revalidated,
        now: Date.now(),
        message: message
    });
}