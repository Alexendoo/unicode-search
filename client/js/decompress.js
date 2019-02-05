const continuationBit = 1 << 7;
const lowBitsMask = ~continuationBit & 0xff;

/**
 * @template {ArrayBufferView} T
 *
 * @param {ReadableStream<Uint8Array>} stream
 * @param {number} length of the returned ArrayBufferView
 * @param {new (length: number) => T} Type
 *
 * @returns {T}
 */
export async function decompress(stream, length, Type) {
    const reader = stream.getReader();
    const output = new Type(length);
    let outIndex = 0;

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
                output[outIndex++] = result;
                result = shift = 0;
                continue;
            }

            shift += 7;
        }
    }
}
