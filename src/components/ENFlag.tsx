const ENFlag = ({
    className = "w-10 h-10",
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
            // style={{enableBackground: "new 0 0 512 336"} as React.CSSProperties}
        >
            <path
                fill="#41479b"
                style={{ fill: "#41479b" }}
                d="m473.7 0.3h-435.4c-21.1 0-38.3 17.1-38.3 38.3v258.8c0 21.2 17.2 38.3 38.3 38.3h435.4c21.1 0 38.3-17.1 38.3-38.3v-258.8c0-21.2-17.2-38.3-38.3-38.3z"
            />
            <path
                style={{ fill: "#f5f5f5" }}
                d="m511.5 32.3c-3.1-18.2-18.8-32-37.8-32h-10l-163.6 107.1v-107.1h-88.2v107.1l-163.6-107.1h-10c-19 0-34.7 13.8-37.8 32l139.8 91.6h-140.3v88.2h140.3l-139.8 91.6c3.1 18.2 18.8 32 37.8 32h10l163.6-107.1v107.1h88.2v-107.1l163.6 107.1h10c19 0 34.7-13.8 37.8-32l-139.8-91.6h140.3v-88.2h-140.3z"
            />
            <g>
                <path
                    fillRule="evenodd"
                    fill="#ff4b55"
                    style={{ fill: "#ff4b55" }}
                    d="m282.5 0.3h-53v141.2h-229.5v53h229.5v141.2h53v-141.2h229.5v-53h-229.5z"
                />
                <path
                    style={{ fill: "#ff4b55" }}
                    d="m24.8 333.3l186.6-121.2h-32.5l-169.7 110.2c4.2 4.9 9.5 8.7 15.6 11z"
                />
                <path
                    style={{ fill: "#ff4b55" }}
                    d="m346.4 212.1h-32.4l180.7 117.3c5-3.3 9.3-7.8 12.3-13z"
                />
                <path
                    style={{ fill: "#ff4b55" }}
                    fill="#ff4b55"
                    d="m4 21.5l157.8 102.4h32.4l-178.7-116.1c-4.8 3.6-8.8 8.3-11.5 13.7z"
                />
                <path
                    style={{ fill: "#ff4b55" }}
                    fill="#ff4b55"
                    d="m332.6 123.9l170-110.4c-4.2-4.8-9.6-8.6-15.7-10.9l-186.8 121.3z"
                />
            </g>
        </svg>
    );
};

export default ENFlag;
