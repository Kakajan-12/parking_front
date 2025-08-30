"use client";

import React from "react";
import Loader from "@/components/Loader";

export default function Loading() {
    return (
        <html>
        <body className="">
        <div className="relative h-screen flex justify-center items-center">
            <Loader/>
        </div>
        </body>
        </html>
    );
}
