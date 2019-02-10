const continuationBit = 1 << 7;
const lowBitsMask = ~continuationBit & 0xff;

/**
 * Consume a readable stream of unsigned LEB128 encoded bytes, writing the
 * results into the provided buffer
 *
 * @param {ReadableStream<Uint8Array>} stream A stream of concatenated unsigned
 * LEB128 encoded values
 * @param {Uint32Array} buffer A pre-allocated Uint32Array to write the decoded
 * values into
 */
async function leb128decode(stream, buffer) {
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

export async function decode(stream, bufferLength) {
    const buffer = new Uint32Array(bufferLength);

    console.time("decode");

    await leb128decode(stream, buffer);

    const out = [];

    let i = 0;
    while (i < buffer.length) {
        const index = buffer[i++];
        const length = buffer[i++];

        let last = 0;
        const codepoints = buffer.slice(i, i + length).map(x => {
            const result = last + x;

            last = result;

            return result;
        });

        i += length;

        out.push({ index, codepoints });
    }

    console.timeEnd("decode");

    return out;
}
