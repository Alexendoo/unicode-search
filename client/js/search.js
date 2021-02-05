import init, { search } from "../../target/wasm/wasm";

import "../css/app.css";

(async function start() {
    await init(new URL("../../target/wasm/wasm_bg.wasm", import.meta.url));
    console.log("initialised");

    const searchInput = document.getElementById("search");
    const resultsDiv = document.getElementById("results");

    searchInput.addEventListener("input", () => {
        console.time("search");
        const result = search(searchInput.value);
        console.timeEnd("search");

        console.time("render");
        resultsDiv.innerHTML = result;
        console.timeEnd("render");
    });
})();
