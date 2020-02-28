/* eslint-env worker */

import init, { Searcher } from "../../intermediate/wasm/utf";

onmessage = async ({ data: { module, names, chunkSize } }) => {
    await init(module);

    const searcher = new Searcher(names.length, 1, chunkSize, 0);
    names.forEach(name => searcher.add_line(name));

    onmessage = ({ data: { pattern, chunk, epoch } }) => {
        const result = searcher.search(pattern, chunk);

        console.log("worker:result", { epoch });
        postMessage({ result, epoch }, null, [result]);
    };
    postMessage(null);
};
