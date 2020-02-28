import { useEffect, useState } from "react";
import init, { Collector } from "../../intermediate/wasm/utf";

import wasmUrl from "../../intermediate/wasm/utf_bg.wasm";
import codepointsUrl from "../../intermediate/data/codepoints.bin";
import namesUrl from "../../intermediate/data/names.txt";
import "../css/app.css";
import SearchPool from "./search-pool";

const CHUNK_SIZE = 4096;

async function createWorker(name, initialData) {
    /** @type {Worker} */
    const worker = await new Promise((resolve, reject) => {
        const pendingWorker = new Worker("./worker", { name, type: "module" });

        pendingWorker.postMessage(initialData);

        pendingWorker.onmessage = () => resolve(pendingWorker);
        pendingWorker.onerror = reject;
    });

    worker.onerror = null;
    worker.onmessage = null;

    return worker;
}

async function downloadAll() {
    const [codepoints, namesCombied] = await Promise.all([
        fetch(codepointsUrl).then(
            async res => new Uint32Array(await res.arrayBuffer()),
        ),
        fetch(namesUrl).then(res => res.text()),
        init(wasmUrl),
    ]);

    const names = namesCombied.split("\n");
    window.names = names;

    const pool = await Promise.all(
        // TODO: use navigator.hardwareConcurrency
        Array.from({ length: 1 }, (_, i) => {
            return createWorker(`Worker ${i}`, {
                names,
                // eslint-disable-next-line no-underscore-dangle
                module: init.__wbindgen_wasm_module,
                chunkSize: CHUNK_SIZE,
            });
        }),
    );
    window.pool = pool;

    const searchPool = new SearchPool(pool, names.length, CHUNK_SIZE);

    return { names, codepoints, searchPool, Collector };
}

export default function useResources() {
    const [parts, setParts] = useState(null);

    useEffect(() => {
        downloadAll().then(setParts);
    }, []);

    return parts;
}
