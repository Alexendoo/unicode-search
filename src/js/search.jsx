import React, {
    useRef,
    useState,
    useLayoutEffect,
    useEffect,
    StrictMode,
} from "react";
import { render } from "react-dom";

import Entry from "./entry";
import * as files from "./files";
import InputBar from "./input-bar";
import loadPool from "./search-pool";
import initWasm, { SearchResults } from "./wasm";

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
            const result = results.get(i + range.start);

            const index = result.index();

            const codepoint = parts.codepoints[index];
            const name = parts.names[index];

            const style = {
                position: "absolute",
                top: (i + range.start) * itemHeight,
            };

            return (
                <Entry
                    key={index}
                    style={style}
                    codepoint={codepoint}
                    name={name}
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
        parts.searchPool.search(pattern, (newResult) => {
            setResults((oldResult) => {
                if (oldResult.ptr !== 0) oldResult.free();

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

(async function start() {
    const codepoints = fetch(files.codepoints)
        .then((res) => res.arrayBuffer())
        .then((buffer) => new Uint32Array(buffer));
    const names = fetch(files.names)
        .then((res) => res.text())
        .then((text) => text.split("\n"));
    const module = initWasm();

    const searchPool = loadPool(await names, await module);

    const parts = {
        codepoints: await codepoints,
        module: await module,
        names: await names,
        searchPool: await searchPool,
    };

    render(
        <StrictMode>
            <Search parts={parts} />
        </StrictMode>,
        document.getElementById("app"),
    );
})();
