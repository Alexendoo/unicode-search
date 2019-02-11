const continuationBit = 1 << 7;
const lowBitsMask = ~continuationBit & 0xff;

/**
 * Create a transform stream that decodes LEB128 encoded unsigned integers into
 * Uint32Arrays
 */
export function leb128decoder(bufLength = 2048) {
    let index = 0;
    let result = 0;
    let shift = 0;

    let buffer = new Uint32Array(bufLength);

    /**
     * @param {Uint8Array} chunk
     * @param {TransformStreamDefaultController<Uint32Array>} controller
     */
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

    /**
     * @param {TransformStreamDefaultController<Uint32Array>} controller
     */
    function flush(controller) {
        if (index > 0) {
            controller.enqueue(buffer.subarray(0, index));
        }
    }

    return new TransformStream({ transform, flush });
}

/**
 * Create a transform stream that unpacks a stream of Uint32Arrays into
 * individual table entries
 */
export function unpacker() {
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

    /**
     * @param {Uint32Array} chunk
     * @param {TransformStreamDefaultController<object>} controller
     */
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
