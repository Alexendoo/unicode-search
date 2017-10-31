#!/usr/bin/env node
"use strict"

const assert = require("assert")
const fs = require("fs")
const path = require("path")
const sax = require("sax")

const saxStream = sax.createStream(true)

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

  saxStream.on("closetag", nodeName => {
    if (nodeName !== "repertoire") return

    const json = JSON.stringify(names, null, 2)

    fs.writeFile(
      path.join(__dirname, "../src/json/names.json"),
      json,
      assert.ifError,
    )
  })
}

saxStream.on("opentag", node => {
  if (node.name !== "block") return
})

fs.createReadStream(path.join(__dirname, "ucd.all.flat.xml")).pipe(saxStream)
