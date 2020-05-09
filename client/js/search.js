import { SearchResults } from "../../target/wasm/wasm";

import loadFiles from "./search/load-files";

(async function start() {
    const { codepoints, names, pool } = await loadFiles();

    const elements = {
        input: document.getElementById("search"),
        results: document.getElementById("results"),
    };

    elements.input.addEventListener("input", () => {
        const pattern = elements.input.value;
        let results = SearchResults.empty();

        pool.search(pattern, (newResults) => {
            const newResultsDiv = document.createElement("div");
            newResultsDiv.id = "results";

            document.body.replaceChild(newResultsDiv, elements.results);
            elements.results = newResultsDiv;

            results.free();
            results = newResults;
        });
    });
})();
