import React from "react";
import Entry from "./entry";

export default function SearchEntry({ style, index, parts }) {
    const codepoint = parts.codepoints[index];
    const name = parts.names[index];

    return <Entry style={style} codepoint={codepoint} name={name} />;
}
