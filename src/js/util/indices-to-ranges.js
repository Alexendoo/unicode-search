/* eslint-disable no-plusplus */

/**
 * Converts an array of indicies into ranges, e.g.
 *
 * ```
 * [0, 1, 2]    -> [{start: 0, end: 3}]
 * [0, 1, 5, 6] -> [{start: 0, end: 2}, {start: 5, end: 7}]
 * [0, 5]       -> [{start: 0, end: 1}, {start: 5, end: 6}]
 * ```
 *
 * @param {ArrayLike<number>} indices
 */
export default function indicesToRanges(indices) {
    if (indices.length === 0)
        throw RangeError("Indices must be greater than length 0");

    const firstIndex = indices[0];
    const ranges = [
        {
            start: firstIndex,
            end: firstIndex + 1,
        },
    ];

    for (let i = 1; i < indices.length; i++) {
        const start = indices[i];
        const range = ranges[ranges.length - 1];

        if (range.end === start) {
            range.end++;
        } else {
            ranges.push({
                start,
                end: start + 1,
            });
        }
    }

    return ranges;
}
