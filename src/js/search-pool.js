import { Collector, SearchResults } from "../../intermediate/wasm/utf";

/* eslint-disable no-param-reassign */

export default class SearchPool {
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
