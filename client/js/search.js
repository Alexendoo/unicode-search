import { SearchResults } from "../../target/wasm/utf";

import createResult from "./search/create-result";
import loadFiles from "./search/load-files";

(async function start() {
    const { codepoints, names, pool } = await loadFiles();

    /** @type {HTMLInputElement} */
    const input = document.getElementById("search");
    let resultsDiv = document.getElementById("results");

    input.addEventListener("input", () => {
        const pattern = input.value;
        let previousResults = SearchResults.empty();

        pool.search(pattern, (results) => {
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

                resultsDiv.appendChild(createResult(index, names, codepoints));
            }
        });
    });
})();
