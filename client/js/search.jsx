import React, { useRef, useState, useLayoutEffect } from "react";
import SearchEntry from "./search-entry";
import InputBar from "./input-bar";

function SearchList({ indicies, parts }) {
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

    const rootStyle = {
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

    let resultIndicies = new Uint32Array();
    if (pattern.length > 0 && parts !== null) {
        resultIndicies = parts.searcher.indicies(pattern.toUpperCase());
    }

    return (
        <div>
            <InputBar value={pattern} onChange={setPattern} />
            <SearchList indicies={resultIndicies} parts={parts} />
        </div>
    );
}
