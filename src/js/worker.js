/* eslint-env worker */

importScripts("/wasm/utf.js");

/** @type {import("../wasm/utf")} */
const { Searcher } = wasm_bindgen;

async function setup() {
    await wasm_bindgen("/wasm/utf_bg.wasm");

    console.log(Searcher);
}

setup();
