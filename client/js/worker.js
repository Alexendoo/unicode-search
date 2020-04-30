/* eslint-env worker */

import init, { Searcher } from "../../target/wasm/utf";

onmessage = async ({ data: { module, names, workerNumber, numWorkers } }) => {
    await init(module);

    const searcher = new Searcher(names.length, numWorkers, workerNumber);
    names.forEach((name) => searcher.add_line(name));

    onmessage = ({ data: { pattern, epoch } }) => {
        const timeStr = `worker:${workerNumber}:search`;
        console.time(timeStr);
        const { buffer } = searcher.search(pattern);
        console.timeEnd(timeStr);

        postMessage({ buffer, epoch }, [buffer]);
    };
    postMessage(null);
};
