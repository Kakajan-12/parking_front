"use client"
import React from "react";
import Loader from "@/components/Loader";


export default function Loading() {
    return (
        <div className="h-96 flex justify-center items-center">
            <Loader/>
        </div>
    );
}
