"use strict"

const assert = require("assert")
const fs = require("fs")
const path = require("path")
const prettier = require("prettier")
const sax = require("sax")

const saxStream = sax.createStream(true)

const dir = (...pathSegments) => path.resolve(__dirname, ...pathSegments)
const dataDir = (...pathSegments) => dir("../src/ts/data", ...pathSegments)

// https://www.unicode.org/versions/Unicode10.0.0/ch04.pdf
// Table 4-8. Name Derivation Rule Prefix Strings
const nameDerivationRules = [
  { start: 0xac00, end: 0xd7a3, prefix: "HANGUL SYLLABLE " },
  { start: 0x3400, end: 0x4db5, prefix: "CJK UNIFIED IDEOGRAPH-" },
  { start: 0x4e00, end: 0x9fea, prefix: "CJK UNIFIED IDEOGRAPH-" },
  { start: 0x20000, end: 0x2a6d6, prefix: "CJK UNIFIED IDEOGRAPH-" },
  { start: 0x2a700, end: 0x2b734, prefix: "CJK UNIFIED IDEOGRAPH-" },
  { start: 0x2b740, end: 0x2b81d, prefix: "CJK UNIFIED IDEOGRAPH-" },
  { start: 0x2b820, end: 0x2cea1, prefix: "CJK UNIFIED IDEOGRAPH-" },
  { start: 0x2ceb0, end: 0x2ebe0, prefix: "CJK UNIFIED IDEOGRAPH-" },
  { start: 0x17000, end: 0x187ec, prefix: "TANGUT IDEOGRAPH-" },
  { start: 0x1b170, end: 0x1b2fb, prefix: "NUSHU CHARACTER-" },
  { start: 0xf900, end: 0xfa6d, prefix: "CJK COMPATIBILITY IDEOGRAPH-" },
  { start: 0xfa70, end: 0xfad9, prefix: "CJK COMPATIBILITY IDEOGRAPH-" },
  { start: 0x2f800, end: 0x2fa1d, prefix: "CJK COMPATIBILITY IDEOGRAPH-" },
]

/**
 * @param {number} code
 */
function isDerived(code) {
  return nameDerivationRules.some(
    range => code >= range.start && code <= range.end,
  )
}

const prettierConfig = prettier.resolveConfig.sync(dir(".."))

/**
 * Stamps a template with any data, formats it and writes to path
 *
 * @param {string} template - string with % in place of data that should be
 *                            substituted
 * @param {any} data
 * @param {string} path
 */
function writeData(template, data, path) {
  const json = JSON.stringify(data)
  const formatted = prettier.format(template.replace("%", json), {
    ...prettierConfig,
    parser: "typescript",
  })

  fs.writeFileSync(path, formatted)
}

// Characters
{
  const names = {}

  let char = {
    code: -1,
    name: "",
  }

  saxStream.on("opentag", node => {
    const attr = node.attributes
    if (node.name !== "char" || attr.na === undefined || attr.cp === undefined)
      return

    char.code = parseInt(attr.cp, 16)
    char.name = attr.na.replace(/#/g, attr.cp)
  })

  saxStream.on("opentag", node => {
    if (node.name !== "name-alias") return
    const attr = node.attributes

    switch (attr.type) {
      case "correction":
        char.name = attr.alias
        break
      case "control":
      case "figment":
        if (char.name === "") char.name = attr.alias
        break
    }
  })

  saxStream.on("closetag", nodeName => {
    if (nodeName !== "char" || isDerived(char.code) || char.code === -1) return

    names[char.code] = char.name

    char = {
      code: -1,
      name: "",
    }
  })

  const template = `
export interface Names {
  [codePoint: number]: string
}

export const names: Names = %
`

  saxStream.on("closetag", nodeName => {
    if (nodeName !== "repertoire") return

    writeData(template, names, dataDir("names.ts"))
  })
}

// Blocks
{
  const blocks = []

  saxStream.on("opentag", node => {
    if (node.name !== "block") return
    const attr = node.attributes

    blocks.push({
      name: attr.name,
      start: parseInt(attr["first-cp"], 16),
      end: parseInt(attr["last-cp"], 16),
    })
  })

  const template = `
export interface Block {
  name: string
  start: number
  end: number
}

export const blocks: Array<Block> = %
`

  saxStream.on("closetag", nodeName => {
    if (nodeName !== "blocks") return

    writeData(template, blocks, dataDir("blocks.ts"))
  })
}

fs.createReadStream(dir("ucd.all.flat.xml")).pipe(saxStream)
