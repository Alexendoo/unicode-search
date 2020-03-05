import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

import { SearchResults } from "../../intermediate/wasm/utf";

import InputBar from "./input-bar";
import SearchEntry from "./search-entry";

function SearchList({ results, parts }) {
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
    }, [results]);

    const rootStyle = {
        height: itemHeight * results.length(),
        position: "relative",
    };

    const items = Array.from(
        {
            length: Math.min(range.length, results.length()),
        },
        (_, i) => {
            const { index } = results.get(i + range.start);

            const style = {
                position: "absolute",
                top: (i + range.start) * itemHeight,
            };

            return (
                <SearchEntry
                    index={index}
                    parts={parts}
                    key={index}
                    style={style}
                />
            );
        },
    );

    return (
        <div style={rootStyle} ref={root}>
            {items}
        </div>
    );
}

export default function Search({ parts }) {
    const [pattern, setPattern] = useState("");
    const [results, setResults] = useState(() => SearchResults.empty());

    useEffect(() => {
        parts.searchPool.search(pattern, newResult => {
            setResults(oldResult => {
                oldResult.free();

                return newResult;
            });
        });
    }, [pattern, parts]);

    return (
        <div>
            <InputBar value={pattern} onChange={setPattern} />
            <SearchList results={results} parts={parts} />
        </div>
    );
}
