/* eslint-disable no-plusplus */

/**
 * @param {Element} root
 */
function calculateRange(root) {
    const bounds = root.getBoundingClientRect();

    const scrolledBy = Math.max(0, -bounds.top);
    const itemHeight = 24;

    const start = Math.floor(scrolledBy / itemHeight);
    const length = Math.ceil(window.innerHeight / itemHeight);

    return { start, end: start + length };
}

function createResult(index, names, codepoints) {
    function div(className) {
        const element = document.createElement("div");
        element.className = className;
        return element;
    }

    const char = div("char");

    const literal = div("literal");
    literal.textContent = String.fromCodePoint(codepoints[index]);

    const name = div("name");
    name.textContent = names[index];

    char.appendChild(literal);
    char.appendChild(name);

    return char;
}

/**
 * @param {Element} root
 * @param {*} prev
 * @param {import("./wasm").SearchResults} results
 */
export default function updateResults(root, prev, results) {
    const { start, end } = calculateRange(root);

    if (start > prev.start) {
        for (let i = 0; i < start - prev.start; i++) {
            root.removeChild(root.firstChild);
        }
    }

    if (end < prev.end) {
        for (let i = 0; i < prev.end - end; i++) {
            root.removeChild(root.lastChild);
        }
    }

    if (start < prev.start) {
        for (let i = 0; i < prev.start - start; i++) {
            console.log("start", i);
        }
    }

    if (end > prev.end) {
        for (let i = 0; i < end - prev.end; i++) {
            console.log("end", i);
        }
    }
}
