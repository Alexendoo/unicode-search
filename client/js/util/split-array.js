/**
 * Split an array into `count` different arrays of roughly equal length
 *
 * ```js
 * splitArray([1, 2, 3, 4, 5, 6], 2)
 * // [[1, 3, 5], [2, 4, 6]]
 *
 * splitArray([1, 2, 3, 4, 5, 6], 3)
 * // [[1, 4], [2, 5], [3, 6]]
 * ```
 *
 * @template T
 * @param {T[]} array Array to split
 * @param {number} count Number of arrays to split into
 * @returns {T[][]}
 */
export default function splitArray(array, count) {
    const out = Array.from({ length: count }, () => []);

    array.forEach((item, i) => {
        out[i % count].push(item);
    });

    return out;
}
