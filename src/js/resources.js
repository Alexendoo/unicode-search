import { useEffect, useState } from "react";

import codepointsUrl from "../../intermediate/data/codepoints.bin";
import namesUrl from "../../intermediate/data/names.txt";
import init, { Collector } from "../../intermediate/wasm/utf";
import wasmUrl from "../../intermediate/wasm/utf_bg.wasm";

import SearchPool from "./search-pool";
import splitArray from "./util/split-array";

import "../css/app.css";

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

    /** @type {string[]} */
    const names = namesCombied.split("\n");
    window.names = names;

    const numWorkers = navigator.hardwareConcurrency;

    const pool = await Promise.all(
        splitArray(names, navigator.hardwareConcurrency).map(
            (nameChunk, workerNumber) =>
                createWorker(`Worker ${workerNumber}`, {
                    names: nameChunk,
                    workerNumber,
                    numWorkers,

                    // eslint-disable-next-line no-underscore-dangle
                    module: init.__wbindgen_wasm_module,
                }),
        ),
    );
    window.pool = pool;

    const searchPool = new SearchPool(pool);

    return { names, codepoints, searchPool, Collector };
}

export default function useResources() {
    const [parts, setParts] = useState(null);

    useEffect(() => {
        downloadAll().then(setParts);
    }, []);

    return parts;
}
