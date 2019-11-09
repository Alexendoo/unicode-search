import { useEffect, useState } from "react";

async function download(name, BufferType) {
    const response = await fetch(`/data/${name}`);

    if (!BufferType) {
        return response.text();
    }

    const buffer = await response.arrayBuffer();

    return new BufferType(buffer);
}

async function downloadAll() {
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

    return { names, codepoints, searcher };
}

export default function useResources() {
    const [parts, setParts] = useState(null);

    useEffect(() => {
        downloadAll().then(setParts);
    }, []);

    return parts;
}
