import boundsURL from "../data/bounds.bin";
import codepointsURL from "../data/codepoints.bin";
import namesURL from "../data/names.txt";
import tableURL from "../data/table.bin";

import "../index.html";

async function fetchBytes(url) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    return new Uint8Array(buffer);
}

async function fetchString(url) {
    const response = await fetch(url);

    return response.text();
}

async function main() {
    console.time("download");
    const [wasm, bounds, names, table, codepoints] = await Promise.all([
        import("../pkg/utf"),
        fetchBytes(boundsURL),
        fetchString(namesURL),
        fetchBytes(tableURL),
        fetchBytes(codepointsURL),
    ]);
    console.timeEnd("download");

    const splitNames = names.split("\n");

    console.time("points")
    const view = new DataView(codepoints.buffer);
    const points = Array.from({ length: view.byteLength / 4 }, (_, i) => {
        return {
            codepoint: view.getUint32(i * 4, true),
            name: splitNames[i],
        };
    });
    console.timeEnd("points")

    console.time("searcher");
    wasm.init();
    const searcher = new wasm.Searcher(names, table, bounds);
    console.timeEnd("searcher");

    window.searcher = searcher;
    window.names = names;
    window.points = points
}

main();
