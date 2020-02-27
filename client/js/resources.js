import { useEffect, useState } from "react";

/** @type {import("../wasm/utf")} */
const { Searcher } = wasm_bindgen;

async function downloadAll() {
    const [codepoints, namesCombied] = await Promise.all([
        fetch("/data/codepoints.bin").then(
            async res => new Uint32Array(await res.arrayBuffer()),
        ),
        fetch("/data/names.txt").then(res => res.text()),
        wasm_bindgen("/wasm/utf_bg.wasm"),
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
