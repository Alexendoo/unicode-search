import React from "react";

export default function Entry({ style, codepoint, name }) {
    const literal = String.fromCodePoint(codepoint);

    return (
        <div className="char" style={style}>
            <span className="literal">{literal}</span>
            <span className="name">{name}</span>
        </div>
    );
}
