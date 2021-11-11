import init, { names_ptr, names_len, Searcher } from "../../target/wasm/wasm";

import "../css/app.css";

const searchInput = document.getElementById("codepoint-search");
const resultsDiv = document.getElementById("results");

let names;

const ROW_HEIGHT = 24;

function create(index, cp) {
    const char = document.createElement("div");
    char.className = "char";
    char.style = `top: ${ROW_HEIGHT * index}px`;

    const codepoint = document.createElement("span");
    codepoint.className = "codepoint";
    codepoint.textContent = `U+${cp
        .toString(16)
        .toUpperCase()
        .padStart(4, "0")}`;
    const literal = document.createElement("span");
    literal.className = "literal";
    literal.textContent = String.fromCodePoint(cp);
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = names[index];

    char.append(codepoint, literal, name);

    return char;
}

export function pushStart(index, codepoint) {
    resultsDiv.insertBefore(create(index, codepoint), resultsDiv.firstChild);
}

export function pushEnd(index, codepoint) {
    resultsDiv.appendChild(create(index, codepoint));
}

export function popStart() {
    resultsDiv.removeChild(resultsDiv.firstChild);
}

export function popEnd() {
    resultsDiv.removeChild(resultsDiv.lastChild);
}

export function clear() {
    while (resultsDiv.lastChild) resultsDiv.removeChild(resultsDiv.lastChild);
}

(async function main() {
    const { memory } = await init(
        new URL("../../target/wasm/wasm_bg.wasm", import.meta.url),
    );
    const searcher = new Searcher();
    window.searcher = searcher;

    const bytes = new Uint8Array(memory.buffer, names_ptr(), names_len());
    names = new TextDecoder().decode(bytes).split("\n");

    function update() {
        const start = Math.floor(Math.max(0, window.scrollY - 50) / ROW_HEIGHT);
        const rows = Math.ceil(window.innerHeight / ROW_HEIGHT) + 1;
        const end = Math.min(searcher.len(), start + rows);

        searcher.render(start, end);
    }

    function onInput() {
        searcher.search(searchInput.value);

        const total = searcher.len();
        resultsDiv.style.height = `${total * ROW_HEIGHT}px`;

        update();
    }

    searchInput.addEventListener("input", onInput);
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
})();
