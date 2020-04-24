import splitArray from "./util/split-array";
import { Collector, SearchResults } from "./wasm";

class SearchPool {
    /**
     * @param {Array<Worker>} pool
     */
    constructor(pool) {
        this.pool = pool;
        this.epoch = 0;
        this.decoder = new TextDecoder();
    }

    clear() {
        this.epoch += 1;
        this.pool.forEach((worker) => {
            // eslint-disable-next-line no-param-reassign
            worker.onmessage = null;
        });
    }

    /**
     * @param {string} pattern
     * @param {function} callback
     */
    search(pattern, callback) {
        this.epoch += 1;

        if (pattern === "") {
            callback(SearchResults.empty());
            return;
        }

        const collector = new Collector(this.pool.length);

        this.pool.forEach((worker) => {
            worker.postMessage({ pattern, epoch: this.epoch });

            // eslint-disable-next-line no-param-reassign
            worker.onmessage = ({ data }) => {
                if (data.epoch !== this.epoch) {
                    // Old event, ignore it
                    return;
                }

                console.time("Receive");
                const done = collector.collect(new Uint8Array(data.buffer));
                console.timeEnd("Receive");

                if (done) {
                    // Done
                    console.time("Done");
                    const results = collector.build();
                    console.timeEnd("Done");

                    console.time("Callback");
                    callback(results);
                    console.timeEnd("Callback");
                }
            };
        });
    }
}

async function createWorker(initialData) {
    /** @type {Worker} */
    const worker = await new Promise((resolve, reject) => {
        const pendingWorker = new Worker("./worker", {
            name: `Worker ${initialData.workerNumber}`,
            type: "module",
        });

        pendingWorker.postMessage(initialData);

        pendingWorker.onmessage = () => resolve(pendingWorker);
        pendingWorker.onerror = reject;
    });

    worker.onerror = null;
    worker.onmessage = null;

    return worker;
}

export default async function loadPool(names, module) {
    const numWorkers = navigator.hardwareConcurrency;

    const workers = await Promise.all(
        splitArray(names, numWorkers).map((nameChunk, workerNumber) =>
            createWorker({
                names: nameChunk,
                workerNumber,
                numWorkers,
                module,
            }),
        ),
    );

    return new SearchPool(workers);
}
