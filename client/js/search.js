import init, { names_ptr, names_len, Searcher } from "../../target/wasm/wasm";

import "../css/app.css";

const searchInput = document.getElementById("codepoint-search");
const resultsDiv = document.getElementById("results");

let names;

function create(cp) {
    const char = document.createElement("div");
    char.className = "char";

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
    name.textContent = "name";

    char.append(codepoint, literal, name);

    return char;
}

export function push_front(cp) {
    console.log("push_front");
    resultsDiv.insertBefore(create(cp), resultsDiv.firstChild);
}

export function push_back(cp) {
    console.log("push_back");
    resultsDiv.appendChild(create(cp));
}

export function pop_front() {
    console.log("pop_front");
    resultsDiv.removeChild(resultsDiv.firstChild);
}

export function pop_back() {
    console.log("pop_back");
    resultsDiv.removeChild(resultsDiv.lastChild);
}

export function clear() {
    console.log("clear");
    while (resultsDiv.lastChild) resultsDiv.removeChild(resultsDiv.lastChild);
}

(async function start() {
    const { memory } = await init(
        new URL("../../target/wasm/wasm_bg.wasm", import.meta.url),
    );
    const searcher = new Searcher();
    window.searcher = searcher;

    const bytes = new Uint8Array(memory.buffer, names_ptr(), names_len());
    names = new TextDecoder().decode(bytes).split("\n");

    searchInput.addEventListener("input", () => {
        searcher.search(searchInput.value);
    });
})();
