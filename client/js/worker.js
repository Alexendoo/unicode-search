/* eslint-env worker */

import init, { Searcher } from "../../target/wasm/wasm";

onmessage = async ({ data: { module, workerNumber, numWorkers } }) => {
    await init(module);

    const searcher = new Searcher(workerNumber, numWorkers);

    onmessage = ({ data: { pattern, epoch } }) => {
        const timeStr = `worker:${workerNumber}:search`;
        console.time(timeStr);
        const { buffer } = searcher.search(pattern);
        console.timeEnd(timeStr);

        postMessage({ buffer, epoch }, [buffer]);
    };
    postMessage(null);
};
