import { SearchResults } from "../../target/wasm/utf";

import createResult from "./search/create-result";
import * as files from "./search/files";
import loadPool from "./search/pool";
import initWasm from "./search/wasm";

(async function start() {
    const codepoints = fetch(files.codepoints)
        .then((res) => res.arrayBuffer())
        .then((buffer) => new Uint32Array(buffer));
    const names = fetch(files.names)
        .then((res) => res.text())
        .then((text) => text.split("\n"));
    const module = initWasm();

    const searchPool = loadPool(names, module);

    const parts = {
        codepoints: await codepoints,
        module: await module,
        names: await names,
        searchPool: await searchPool,
    };

    window.parts = parts;

    /** @type {HTMLInputElement} */
    const input = document.getElementById("search");
    let resultsDiv = document.getElementById("results");

    input.addEventListener("input", () => {
        const pattern = input.value;
        let previousResults = SearchResults.empty();

        parts.searchPool.search(pattern, (results) => {
            const newResultsDiv = document.createElement("div");
            newResultsDiv.id = "results";

            document.body.replaceChild(newResultsDiv, resultsDiv);
            resultsDiv = newResultsDiv;

            previousResults.free();
            previousResults = results;

            const length = Math.min(results.length(), 100);

            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < length; i++) {
                const result = results.get(i);

                const index = result.index();

                resultsDiv.appendChild(
                    createResult(index, parts.names, parts.codepoints),
                );
            }
        });
    });
})();
