import { SearchResults } from "../../target/wasm/wasm";

import createResult from "./search/create-result";
import loadFiles from "./search/load-files";

(async function start() {
    const { codepoints, names, pool } = await loadFiles();

    const searchInput = document.getElementById("search");
    let oldResults = SearchResults.empty();

    searchInput.addEventListener("input", () => {
        pool.search(searchInput.value, (results) => {
            const resultsDiv = document.createElement("div");
            resultsDiv.id = "results";

            const oldResultsDiv = document.getElementById("results");
            document.body.replaceChild(resultsDiv, oldResultsDiv);

            console.time("create pages");
            const pages = Math.ceil(results.length() / 100);
            for (let i = 0; i < pages; i++) {
                const page = document.createElement("div");
                page.className = "page";
                resultsDiv.appendChild(page);
            }
            console.timeEnd("create pages");

            oldResults.free();
            oldResults = results;
        });
    });
})();
