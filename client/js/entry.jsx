import React from "react";

export default function Entry({ style, index, parts }) {
    const codepoint = parts.codepoints[index];

    const char = String.fromCodePoint(codepoint);
    const name = parts.names[index];
    const codepointString = `U+${codepoint.toString(16).toUpperCase()}`;

    return (
        <div className="char" style={style}>
            <span className="codepoint">{codepointString}</span>
            <span className="literal">{char}</span>
            <span className="name">{name}</span>
        </div>
    );
}
