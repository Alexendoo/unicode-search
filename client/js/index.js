import "./wasm.js"

const input = document.getElementById("chars")
const template = document.getElementById("char--template")
const display = document.querySelector("main")
const radios = document.querySelectorAll("input[name=type]")

let type

input.addEventListener("input", () => sendInput())

for (let i = 0; i < radios.length; i++) {
  const radio = radios[i]

  if (radio.checked) type = radio.value

  radio.addEventListener("change", event => {
    type = event.target.value
  })
}

function createCharDetails({ character, name, block, codePoint, bytes }) {
  template.content.querySelector(".char--literal").textContent = character
  template.content.querySelector(".char--name").textContent = name
  template.content.querySelector(".char--block").textContent = block
  template.content.querySelector(".char--code").textContent = String(codePoint)
  template.content.querySelector(".char--bytes").textContent = bytes

  const node = document.importNode(template.content, true)
  display.appendChild(node)
}

/**
 * remove all of the child elements from node
 *
 * @param {Node} node
 */
function clearChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}
