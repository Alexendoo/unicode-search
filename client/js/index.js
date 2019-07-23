import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { FixedSizeList as List } from "react-window";

function useDocumentHeight() {
    const [height, setHeight] = useState(() => window.innerHeight);

    useEffect(() => {
        function handleHeightChange() {
            setHeight(window.innerHeight)
        }

        window.addEventListener("resize", handleHeightChange)

        return () => window.removeEventListener("resize", handleHeightChange)
    })

    return height
}

function Main({ searcher, names }) {
    const [pattern, setPattern] = useState("");
    const height = useDocumentHeight() - 50;

    let resultIndicies;
    if (pattern.length > 0) {
        resultIndicies = searcher.indicies(pattern.toUpperCase());
    } else {
        resultIndicies = new Uint32Array();
    }


    return (
        <div>
            <input
                type="text"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
            />
            <List
                height={height}
                width="100%"
                itemCount={resultIndicies.length}
                itemSize={100}
            >
                {({ index, style }) => <div style={style}>{names[index]}</div>}
            </List>
        </div>
    );
}

async function download(name, format = "bytes") {
    const response = await fetch(`/data/${name}`);

    if (format === "text") {
        return response.text();
    } else {
        const buffer = await response.arrayBuffer();

        return new Uint8Array(buffer);
    }
}

(async function() {
    const [pkg, indicies, codepoints, namesCombied, table] = await Promise.all([
        import("../pkg/utf.js"),
        download("indicies.bin"),
        download("codepoints.bin"),
        download("names.txt", "text"),
        download("table.bin"),
    ]);

    pkg.set_panic_hook();

    const searcher = new pkg.Searcher(namesCombied, table, indicies);
    window.s = searcher;

    const names = namesCombied.split("\n");

    render(
        <Main searcher={searcher} names={names} />,
        document.querySelector("main"),
    );
})();
