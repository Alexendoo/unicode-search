#!/usr/bin/env node
"use strict"

const fs = require("fs")
const path = require("path")
const sax = require("sax")

const saxStream = sax.createStream(true)

{
  // Characters
  let char = {
    code: "",
    name: "",
  }

  saxStream.on("opentag", node => {
    const attr = node.attributes
    if (node.name !== "char" || attr.na === undefined) return

    char.code = attr.cp
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
    if (nodeName !== "char") return

    console.log(char)
    char = {
      code: "",
      name: "",
    }
  })
}

saxStream.on("opentag", node => {
  if (node.name !== "block") return
})

fs.createReadStream(path.join(__dirname, "ucd.test.flat.xml")).pipe(saxStream)
