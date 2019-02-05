const continuationBit = 1 << 7;
const lowBitsMask = ~continuationBit & 0xff;

/**
 * Consume a ReadableStream of LEB128 bytes into an Array of numbers
 *
 * @param {ReadableStream<Uint8Array>} stream
 * @returns {Promise<number[]>}
 */
export async function decompress(stream) {
    const reader = stream.getReader();
    const output = [];

    let result = 0;
    let shift = 0;

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            return output;
        }

        for (const byte of value) {
            result |= (byte & lowBitsMask) << shift;

            if ((byte & continuationBit) === 0) {
                output.push(result);
                result = shift = 0;
                continue;
            }

            shift += 7;
        }
    }
}
