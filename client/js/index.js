import React, { useState, useRef, useLayoutEffect } from "react";
import { render } from "react-dom";

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

function List({ indicies, parts }) {
    const itemHeight = 24;

    const root = useRef(null);
    const [range, setRange] = useState({
        start: 0,
        length: 0,
    });

    useLayoutEffect(() => {
        function calculateRange() {
            const bounds = root.current.getBoundingClientRect();

            const scrolledBy = Math.max(0, -bounds.top);

            const start = Math.floor(scrolledBy / itemHeight);
            const length = Math.ceil(window.innerHeight / itemHeight);

            setRange({ length, start });
        }

        calculateRange();

        window.addEventListener("scroll", calculateRange);

        return () => window.removeEventListener("scroll", calculateRange);
    }, [indicies]);

    const style = {
        height: itemHeight * indicies.length,
        position: "relative",
    };

    const items = Array.from(
        {
            length: Math.min(range.length, indicies.length),
        },
        (_, i) => {
            const index = indicies[i + range.start];

            const style = {
                position: "absolute",
                top: (i + range.start) * itemHeight,
            };

            return (
                <Entry index={index} parts={parts} key={index} style={style} />
            );
        },
    );

    return (
        <div style={style} ref={root}>
            {items}
        </div>
    );
}

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
            <List indicies={resultIndicies} parts={parts} />
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
