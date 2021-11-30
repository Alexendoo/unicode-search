import init, { names_ptr, names_len, Searcher } from "../target/wasm/wasm";

import "./index.css";
import "./index.html";

/** @type {HTMLInputElement} */
const searchInput = document.getElementById("codepoint-search");
const resultsDiv = document.getElementById("results");

let names = "";

const ROW_HEIGHT = 24;
const OFFSET = resultsDiv.offsetTop;

function create(index, cp, start, end) {
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
    name.textContent = names.slice(start, end);

    char.append(codepoint, literal, name);

    return char;
}

export function pushStart(index, codepoint, start, end) {
    resultsDiv.insertBefore(
        create(index, codepoint, start, end),
        resultsDiv.firstChild,
    );
}

export function pushEnd(index, codepoint, start, end) {
    resultsDiv.appendChild(create(index, codepoint, start, end));
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

function main({ memory }) {
    const searcher = new Searcher();
    window.searcher = searcher;

    const bytes = new Uint8Array(memory.buffer, names_ptr(), names_len());
    names = new TextDecoder().decode(bytes);

    function update() {
        const top = window.scrollY - OFFSET;
        const bottom = top + window.innerHeight;

        const start = Math.max(0, Math.floor(top / ROW_HEIGHT));
        const end = Math.min(
            searcher.len(),
            Math.floor(bottom / ROW_HEIGHT) + 1,
        );

        searcher.render(start, end);
    }

    function onInput() {
        const pattern = searchInput.value;

        const codepoints = Array.from(
            pattern.matchAll(/(?:U?\+|\\[ux]?{?)([0-9a-f]{1,8})/gi),
            (match) => parseInt(match[1], 16),
        );

        const isSearch = pattern.match(/^[a-z0-9 -]*$/);

        if (codepoints.length > 0) {
            searcher.codepoints(codepoints);
        } else if (isSearch) {
            searcher.search(pattern);
        } else {
            searcher.codepoints(
                Array.from(pattern, (char) => char.codePointAt()),
            );
        }

        const total = searcher.len();
        resultsDiv.style.height = `${total * ROW_HEIGHT}px`;

        update();
    }

    searchInput.addEventListener("input", onInput);
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
}

init().then(main);
