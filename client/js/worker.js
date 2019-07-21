importScripts("/pkg/utf.js");

/**
 * @type {import("../pkg")}
 */
const { init, Searcher } = wasm_bindgen;

/**
 * @type {import("../pkg").Searcher}
 */
let searcher;

/**
 * @param {MessageEvent} event
 */
function onMessage(event) {
    const buffer = searcher.indicies(event.data).buffer;
    self.postMessage(buffer, [buffer]);
}

async function download(name, format = "bytes") {
    const response = await fetch(`/data/${name}`);

    if (format === "text") {
        return response.text();
    } else {
        const buffer = await response.arrayBuffer();

        return new Uint8Array(buffer);
    }
}

(async function() {
    let event;
    self.onmessage = e => (event = e);

    const [indicies, codepoints, names, table] = await Promise.all([
        download("indicies.bin"),
        download("codepoints.bin"),
        download("names.txt", "text"),
        download("table.bin"),
    ]);

    await wasm_bindgen("/pkg/utf_bg.wasm");
    init();

    console.log(table, indicies);
    searcher = new Searcher(names, table, indicies);

    self.onmessage = onMessage;
    if (event) {
        onMessage(event);
    }
})();
