export default function createResult(index, names, codepoints) {
    function div(className) {
        const element = document.createElement("div");
        element.className = className;
        return element;
    }

    const char = div("char");

    const literal = div("literal");
    literal.textContent = String.fromCodePoint(codepoints[index]);

    const name = div("name");
    name.textContent = names[index];

    char.appendChild(literal);
    char.appendChild(name);

    return char;
}
