import React from "react";

export function Events({ events }: {events: Array<string>}) {
    return (
        <ul>
            {events.map((event, index) => (
                <li key={index}>{event}</li>
            ))}
        </ul>
    );
}
