import React from "react";

export default function InputBar({ onChange, value }) {
    return (
        <div className="input-bar">
            <span>{">"}</span>
            <input
                autoComplete="off"
                onChange={(e) => onChange(e.target.value)}
                type="text"
                value={value}
            />
        </div>
    );
}
