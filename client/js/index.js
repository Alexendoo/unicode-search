import init, { set_panic_hook, Searcher } from "../pkg/utf.js";

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
    const [indicies, codepoints, names, table] = await Promise.all([
        download("indicies.bin"),
        download("codepoints.bin"),
        download("names.txt", "text"),
        download("table.bin"),
    ]);

    await init();
    set_panic_hook();

    console.log(table, indicies);
    const searcher = new Searcher(names, table, indicies);
    window.s = searcher;

    const input = document.getElementById("search");
    const result = document.getElementById("result");

    const chars = names.split("\n");
    window.chars = chars;

    input.oninput = () => {
        const pattern = input.value.toUpperCase();

        if (pattern.length > 0) {
            let indicies = searcher.indicies(pattern);

            let text = "";

            for (let i = 0; i < indicies.length; i++) {
                text += chars[indicies[i]] + "\n";
            }

            result.textContent = text;
        }
    };
})();
