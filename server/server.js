const express = require("express");
const serveStatic = require("serve-static");

const manifest = require("../dist/manifest.json");

const app = express();

app.use("/static", serveStatic("dist"));

app.set("view engine", "ejs");
app.set("views", "server/views");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/search", (req, res) => {
    res.render("search", { manifest });
});

app.listen(3000);
