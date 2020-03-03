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
        this.pool.forEach(worker => {
            worker.onmessage = null;
        });
    }

    /**
     * @param {string} pattern
     * @param {function} callback
     */
    search(pattern, callback) {
        this.epoch += 1;
        const received = [];

        if (pattern === "") {
            callback([]);
            return;
        }

        this.pool.forEach(worker => {
            worker.postMessage({ pattern, epoch: this.epoch });

            worker.onmessage = ({ data }) => {
                if (data.epoch !== this.epoch) {
                    // Old event, ignore it
                    return;
                }

                console.time("Receive");
                const text = this.decoder.decode(new Uint8Array(data.buffer));
                const json = JSON.parse(text);
                received.push(json);
                console.timeEnd("Receive");

                if (received.length === this.pool.length) {
                    // Done
                    console.time("Done");
                    const matches = received.flat();
                    matches.sort((a, b) => {
                        const scoreDiff = b.score - a.score;

                        if (scoreDiff === 0) {
                            return b.index - a.index;
                        }

                        return scoreDiff;
                    });

                    console.timeEnd("Done");
                    console.time("Callback");
                    callback(matches);
                    console.timeEnd("Callback");
                }
            };
        });
    }
}
