import React from "react";
import Entry from "./entry";

function codepointToIndex(codepoint, codepoints) {
    let left = 0;
    let right = codepoints.length - 1;

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const found = codepoints[middle];

        if (found < codepoint) {
            left = middle + 1;
        } else if (found > codepoint) {
            right = middle - 1;
        } else {
            return middle;
        }
    }

    return undefined;
}

function codepointName(codepoint, parts) {
    // TODO: CJK
    // TODO: Construct codepoint -> name map

    const index = codepointToIndex(codepoint, parts.codepoints);

    return index !== undefined ? parts.names[index] : "?";
}

export default function CharEntry({ char, parts }) {
    const codepoint = char.codePointAt();
    const name = codepointName(codepoint, parts);

    return <Entry codepoint={codepoint} name={name} />;
}
