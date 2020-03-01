import React from "react";

export default function Entry({ style, codepoint, name }) {
    const literal = String.fromCodePoint(codepoint);
    const codepointString = `U+${codepoint.toString(16).toUpperCase()}`;

    return (
        <div className="char" style={style}>
            <span className="codepoint">{codepointString}</span>
            <span className="literal">{literal}</span>
            <span className="name">{name}</span>
        </div>
    );
}
