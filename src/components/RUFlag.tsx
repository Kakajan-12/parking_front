import React from "react";

const RUFlag = ({
    className = "h-10 w-10",
    width = 40,
    height = 40,
}: {
    className?: string;
    width?: number;
    height?: number;
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 336"
            // style={{enableBackground: "new 0 0 512 512"} as React.CSSProperties}
        >
            <style>
                {`  .s0 {fill: #f5f5f5}
                    .s1 {fill: #ff4b55}
                    .s2 {fill: #41479b}`}
            </style>
            <path
                className="s0"
                d="m473.7 0.3h-435.4c-21.1 0-38.3 17.1-38.3 38.3v73.5h512v-73.5c0-21.2-17.2-38.3-38.3-38.3z"
            />
            <path
                className="s1"
                d="m0 297.4c0 21.2 17.2 38.3 38.3 38.3h435.4c21.1 0 38.3-17.1 38.3-38.3v-73.5h-512z"
            />
            <path fillRule="evenodd" className="s2" d="m0 112.1h512v111.8h-512z" />
        </svg>
    );
};

export default RUFlag;
