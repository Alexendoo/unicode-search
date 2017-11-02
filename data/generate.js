#!/usr/bin/env node
"use strict"

const assert = require("assert")
const fs = require("fs")
const path = require("path")
const sax = require("sax")

const saxStream = sax.createStream(true)

const dir = (...pathSegments) => path.resolve(__dirname, ...pathSegments)

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
  [codePoint: string]: string
}

const names: Names = %

export default names
`

  saxStream.on("closetag", nodeName => {
    if (nodeName !== "repertoire") return

    const json = JSON.stringify(names, null, 2)
    const namesPath = dir("../src/data/names.ts")

    fs.writeFileSync(namesPath, template.replace("%", json))
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

const blocks: Array<Block> = %

export default blocks
`

  saxStream.on("closetag", nodeName => {
    if (nodeName !== "blocks") return

    const json = JSON.stringify(blocks, null, 2)
    const blocksPath = dir("../src/data/blocks.ts")

    fs.writeFileSync(blocksPath, template.replace("%", json))
  })
}

fs.createReadStream(dir("ucd.all.flat.xml")).pipe(saxStream)
