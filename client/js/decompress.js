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
export async function leb128decode(stream, buffer) {
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

export function leb128decoder(bufLength = 2048) {
    let index = 0;
    let result = 0;
    let shift = 0;

    let buffer = new Uint32Array(bufLength);

    function transform(chunk, controller) {
        for (const byte of chunk) {
            if (index === bufLength) {
                controller.enqueue(buffer);
                buffer = new Uint32Array(bufLength);
                index = 0;
            }

            result |= (byte & lowBitsMask) << shift;

            if ((byte & continuationBit) === 0) {
                buffer[index++] = result;
                result = shift = 0;
                continue;
            }

            shift += 7;
        }
    }

    function flush(controller) {
        if (index > 0) {
            controller.enqueue(buffer.subarray(0, index));
        }
    }

    return new TransformStream({ transform, flush });
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

export function decompressor() {
    const HAS_NONE = 0;
    const HAS_INDEX = 1;
    const HAS_CODEPOINTS = 2;

    let current = {
        index: 0,
        codepoints: null,
    };
    let codepointIndex = 0;
    let lastCodepoint = 0;
    let state = HAS_NONE;

    function transform(chunk, controller) {
        for (const u32 of chunk) {
            switch (state) {
                case HAS_NONE:
                    current.index = u32;

                    state = HAS_INDEX;
                    break;

                case HAS_INDEX:
                    current.codepoints = new Uint32Array(u32);

                    state = HAS_CODEPOINTS;
                    break;

                case HAS_CODEPOINTS:
                    lastCodepoint += u32;
                    current.codepoints[codepointIndex++] = lastCodepoint;

                    if (codepointIndex === current.codepoints.length) {
                        controller.enqueue(current);

                        codepointIndex = lastCodepoint = 0;
                        current = { index: 0, codepoints: null };

                        state = HAS_NONE;
                    }
                    break;
            }
        }
    }
    return new TransformStream({ transform });
}
