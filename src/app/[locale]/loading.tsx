"use client";

import React from "react";

import Loader from "@/components/Loader";

export default function Loading() {
    return (
        <div className="h-full flex justify-center items-center">
            <Loader />
        </div>
    );
}
