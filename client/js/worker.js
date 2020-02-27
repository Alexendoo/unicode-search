/* eslint-env worker */

importScripts("/wasm/utf.js");

/** @type {import("../wasm/utf")} */
const { Searcher, set_panic_hook } = wasm_bindgen;

async function setup() {
    await wasm_bindgen("/wasm/utf_bg.wasm");
    set_panic_hook();

    console.log(Searcher);
}

setup();
