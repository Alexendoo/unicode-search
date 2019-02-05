const continuationBit = 1 << 7;
const lowBitsMask = ~continuationBit & 0xff;

/**
 * Consume a readable stream of unsigned LEB128 encoded bytes, writing the
 * results into the provided buffer
 *
 * @template {ArrayBufferView} T
 * @param {ReadableStream<Uint8Array>} stream A stream of concatenated unsigned
 * LEB128 encoded values
 * @param {T} buffer An ArrayBuffer view to write the decoded values to
 * @returns {T} the passed in `buffer`
 */
export async function decompress(stream, buffer) {
    const reader = stream.getReader();

    let index = 0;
    let result = 0;
    let shift = 0;

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            return buffer;
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
