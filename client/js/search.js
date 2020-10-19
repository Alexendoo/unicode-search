import { SearchResults } from "../../target/wasm/wasm";

import "../css/app.css";
import loadPool from "./search/pool";

(async function start() {
    const pool = await loadPool();

    const searchInput = document.getElementById("search");
    const resultsDiv = document.getElementById("results");

    let oldResults = SearchResults.empty();

    searchInput.addEventListener("input", () => {
        pool.search(searchInput.value, (results) => {
            console.time("render");
            resultsDiv.innerHTML = results.render(100, 1);
            console.timeEnd("render");

            oldResults.free();
            oldResults = results;
        });
    });
})();
