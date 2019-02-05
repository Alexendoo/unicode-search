const continuationBit = 1 << 7;
const lowBitsMask = ~continuationBit & 0xff;

/**
 * Consume a readable stream of unsigned LEB128 encoded bytes, writing the
 * results into the provided buffer
 *
 * @param {ReadableStream<Uint8Array>} stream A stream of concatenated unsigned
 * LEB128 encoded values
 * @param {Uint32Array} buffer A preallocated Uint32Array to write the decoded
 * values into
 */
export async function decompress(stream, buffer) {
    const reader = stream.getReader();

    let index = 0;
    let result = 0;
    let shift = 0;

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            return;
        }

        for (const byte of value) {
            result |= (byte & lowBitsMask) << shift;

            if ((byte & continuationBit) === 0) {
                buffer[index++] = result;
                result = shift = 0;
                continue;
            }

            shift += 7;
        }
    }
}
