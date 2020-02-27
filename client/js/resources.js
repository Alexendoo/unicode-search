import { useEffect, useState } from "react";

async function downloadAll() {
    const [pkg, codepoints, namesCombied] = await Promise.all([
        import("../pkg/utf.js"),
        fetch("/data/codepoints.bin").then(
            async res => new Uint32Array(await res.arrayBuffer()),
        ),
        fetch("/data/names.txt").then(res => res.text()),
    ]);

    pkg.set_panic_hook();

    const names = namesCombied.split("\n");
    window.names = names;

    const searcher = new pkg.Searcher(names.length, 4096);
    window.searcher = searcher;

    return { names, codepoints, searcher };
}

export default function useResources() {
    const [parts, setParts] = useState(null);

    useEffect(() => {
        downloadAll().then(setParts);
    }, []);

    return parts;
}
