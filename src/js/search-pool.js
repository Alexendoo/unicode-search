/* eslint-disable no-param-reassign */

export default class SearchPool {
    /**
     * @param {Array<Worker>} pool
     * @param {number} namesLength
     * @param {number} chunkSize
     */
    constructor(pool, namesLength, chunkSize) {
        this.pool = pool;
        this.namesLength = namesLength;
        this.chunkSize = chunkSize;
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

        this.pool.forEach(worker => {
            let chunk = 0;

            const send = epoch => {
                worker.postMessage({ pattern, epoch, chunk });

                chunk += 1;
            };

            const onMessage = ({ data }) => {
                console.log("onMessage", {
                    dataEpoch: data.epoch,
                    thisEpoch: this.epoch,
                    chunk,
                    limit: this.namesLength / this.chunkSize,
                });

                if (data.epoch !== this.epoch) {
                    // Old event, ignore it
                    return;
                }

                const text = this.decoder.decode(data.result);
                const json = JSON.parse(text);
                callback(json);

                if (chunk * this.chunkSize > this.namesLength) {
                    // Finished
                    console.log("finished");
                    worker.onmessage = null;
                    return;
                }

                send(this.epoch);
            };

            worker.onmessage = onMessage;
            send(this.epoch);
        });
    }
}
