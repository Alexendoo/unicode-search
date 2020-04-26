/* eslint-env worker */

import init, { Searcher } from "../../intermediate/wasm/utf";

onmessage = async ({ data: { module, names, workerNumber, numWorkers } }) => {
    await init(module);

    const searcher = new Searcher(names.length, numWorkers, workerNumber);
    names.forEach((name) => searcher.add_line(name));

    // TODO: Spin event loop to flush old epoch requests?
    onmessage = ({ data: { pattern, epoch } }) => {
        const timeStr = `worker:${workerNumber}:search`;
        console.time(timeStr);
        const { buffer } = searcher.search(pattern);
        console.timeEnd(timeStr);

        postMessage({ buffer, epoch }, [buffer]);
    };
    postMessage(null);
};
