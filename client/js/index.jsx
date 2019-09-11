import React, { useState } from "react";
import { render } from "react-dom";
import Search from "./search";

function Main({ searcher, parts }) {
    const [pattern, setPattern] = useState("");

    let resultIndicies = new Uint32Array();
    if (pattern.length > 0) {
        resultIndicies = searcher.indicies(pattern.toUpperCase());
    }

    return (
        <div>
            <div className="input-bar">
                <span>{">"}</span>
                <input
                    autoComplete="off"
                    onChange={e => setPattern(e.target.value)}
                    type="text"
                    value={pattern}
                />
            </div>
            <Search indicies={resultIndicies} parts={parts} />
        </div>
    );
}

async function download(name, BufferType) {
    const response = await fetch(`data/${name}`);

    if (!BufferType) {
        return response.text();
    }

    const buffer = await response.arrayBuffer();

    return new BufferType(buffer);
}

(async function main() {
    const [pkg, indicies, codepoints, namesCombied, table] = await Promise.all([
        import("../pkg/utf.js"),
        download("indicies.bin", Uint8Array),
        download("codepoints.bin", Uint32Array),
        download("names.txt"),
        download("table.bin", Uint8Array),
    ]);

    pkg.set_panic_hook();

    const searcher = new pkg.Searcher(namesCombied, table, indicies);

    const names = namesCombied.split("\n");

    const parts = { names, codepoints };

    window.s = searcher;
    window.parts = parts;

    render(
        <Main searcher={searcher} parts={parts} />,
        document.querySelector("main"),
    );
})();
