import { CharMessage } from "../worker/messages"
import { codePointToChar } from "../util"

const template = document.getElementById("char-template") as HTMLTemplateElement

const field = (selector: string) =>
  template.content.querySelector(".char__" + selector) as HTMLDivElement

const literal = field("literal")
const charName = field("name")
const block = field("block")
const code = field("code")
const utf8 = field("utf8")

export function charElement(message: CharMessage) {
  literal.textContent = codePointToChar(message.codepoint)
  charName.textContent = message.name

  return document.importNode(template.content, true)
}
