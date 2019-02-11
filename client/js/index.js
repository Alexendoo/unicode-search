import { unpacker, leb128decoder } from "./decompress.js";

function findRange(entries, combined, substring) {
    let left = 0;
    let right = entries.length;

    function slice(start) {
        return combined.slice(start, start + substring.length);
    }

    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        const entry = entries[mid];

        if (substring > slice(entry.index)) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    const start = left;
    right = entries.length;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        const entry = entries[mid];

        if (substring < slice(entry.index)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return {
        start: start,
        end: right,
    };
}

async function main() {
    console.time("main");
    const [tableResponse, combined] = await Promise.all([
        fetch("data/table.bin"),
        fetch("data/combined.txt").then(r => r.text()),
    ]);

    const reader = tableResponse.body
        .pipeThrough(leb128decoder())
        .pipeThrough(unpacker())
        .getReader();
    const table = [];

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        table.push(value);
    }

    window.table = table;
    window.combined = combined;

    window.findRange = findRange;

    console.timeEnd("main");
}

main();

// const input = document.getElementById("chars");
// const template = document.getElementById("char--template");
// const display = document.querySelector("main");
// const radios = document.querySelectorAll("input[name=type]");

// let type;

// input.addEventListener("input", () => sendInput());

// for (let i = 0; i < radios.length; i++) {
//     const radio = radios[i];

//     if (radio.checked) type = radio.value;

//     radio.addEventListener("change", event => {
//         type = event.target.value;
//     });
// }

// function createCharDetails({ character, name, block, codePoint, bytes }) {
//     template.content.querySelector(".char--literal").textContent = character;
//     template.content.querySelector(".char--name").textContent = name;
//     template.content.querySelector(".char--block").textContent = block;
//     template.content.querySelector(".char--code").textContent = String(
//         codePoint,
//     );
//     template.content.querySelector(".char--bytes").textContent = bytes;

//     const node = document.importNode(template.content, true);
//     display.appendChild(node);
// }

// /**
//  * remove all of the child elements from node
//  *
//  * @param {Node} node
//  */
// function clearChildren(node) {
//     while (node.firstChild) {
//         node.removeChild(node.firstChild);
//     }
// }
