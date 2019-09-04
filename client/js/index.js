import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { FixedSizeList as List } from "react-window";

function useWindowHeight() {
    const [height, setHeight] = useState(() => window.innerHeight);

    useEffect(() => {
        function handleHeightChange() {
            setHeight(window.innerHeight);
        }

        window.addEventListener("resize", handleHeightChange);

        return () => window.removeEventListener("resize", handleHeightChange);
    }, []);

    return height;
}

function Entry({ style, index, parts }) {
    const codepoint = parts.codepoints[index];

    const char = String.fromCodePoint(codepoint);
    const name = parts.names[index];
    const codepointString = "U+" + codepoint.toString(16).toUpperCase();

    return (
        <div className="char" style={style}>
            <span className="codepoint">{codepointString}</span>
            <span className="literal">{char}</span>
            <span className="name">{name}</span>
        </div>
    );
}

function Main({ searcher, parts }) {
    const [pattern, setPattern] = useState("");
    const height = useWindowHeight() - 50;

    let resultIndicies = new Uint32Array();
    if (pattern.length > 0) {
        resultIndicies = searcher.indicies(pattern.toUpperCase());
    }

    const inputRef = useRef(null);

    useEffect(() => {
        function focusInput() {
            inputRef.current.focus();
        }

        document.addEventListener("keydown", focusInput);

        return () => document.removeEventListener("keydown", focusInput);
    }, []);

    return (
        <div>
            <div className="input-bar">
                <span>{">"}</span>
                <input
                    autoComplete="off"
                    autoFocus
                    onChange={e => setPattern(e.target.value)}
                    ref={inputRef}
                    type="text"
                    value={pattern}
                />
            </div>
            <List
                height={height}
                width="100%"
                itemCount={resultIndicies.length}
                itemSize={24}
            >
                {({ index, style }) => (
                    <Entry
                        style={style}
                        index={resultIndicies[index]}
                        parts={parts}
                    />
                )}
            </List>
        </div>
    );
}

async function download(name, BufferType) {
    const response = await fetch(`data/${name}`);

    if (!BufferType) {
        return response.text();
    } else {
        const buffer = await response.arrayBuffer();

        return new BufferType(buffer);
    }
}

(async function() {
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
