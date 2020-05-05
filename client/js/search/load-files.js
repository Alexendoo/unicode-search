import * as files from "./files";
import loadPool from "./pool";
import initWasm from "./wasm";

export default async function loadFiles() {
    const codepoints = fetch(files.codepoints)
        .then((res) => res.arrayBuffer())
        .then((buffer) => new Uint32Array(buffer));
    const names = fetch(files.names)
        .then((res) => res.text())
        .then((text) => text.split("\n"));

    const module = initWasm();
    const pool = loadPool(names, module);

    return {
        codepoints: await codepoints,
        module: await module,
        names: await names,
        pool: await pool,
    };
}
