import React, {
    useRef,
    useState,
    useLayoutEffect,
    useEffect,
    useReducer,
} from "react";
import SearchEntry from "./search-entry";
import InputBar from "./input-bar";

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
        height: itemHeight * results.length,
        position: "relative",
    };

    const items = Array.from(
        {
            length: Math.min(range.length, results.length),
        },
        (_, i) => {
            const { index } = results[i + range.start];

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

let markn = 0;

export default function Search({ parts }) {
    const [pattern, setPattern] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        setResults([]);

        if (parts === null) return;

        const searcher = parts.searchPool;

        if (pattern === "") {
            searcher.clear();
            return;
        }

        markn += 1;
        const localMark = markn;
        const mark = `search:${localMark}:start`;
        performance.mark(mark);

        searcher.search(pattern, matches => {
            setResults(old => {
                const sorted = old
                    .concat(matches)
                    .sort((a, b) => b.score - a.score);
                performance.measure(`search:${localMark}:result`, mark);

                return sorted;
            });
        });

        return () => console.log("DEAD");
    }, [pattern, parts]);

    return (
        <div>
            <InputBar value={pattern} onChange={setPattern} />
            <SearchList results={results} parts={parts} />
        </div>
    );
}
