import { useEffect, useState } from "react";
import init, { Searcher } from "../../intermediate/wasm/utf";

import wasm from "../../intermediate/wasm/utf_bg.wasm";
import "../css/app.css";

async function downloadAll() {
    const [codepoints, namesCombied] = await Promise.all([
        fetch("/data/codepoints.bin").then(
            async res => new Uint32Array(await res.arrayBuffer()),
        ),
        fetch("/data/names.txt").then(res => res.text()),
        init(wasm),
    ]);

    const names = namesCombied.split("\n");
    window.names = names;

    const searcher = new Searcher(names.length, 4096);
    window.searcher = searcher;

    window.w = new Worker("./worker", { type: "module" });

    return { names, codepoints, searcher };
}

export default function useResources() {
    const [parts, setParts] = useState(null);

    useEffect(() => {
        downloadAll().then(setParts);
    }, []);

    return parts;
}
