const fs = require("fs");

require("dotenv").config();

const html = fs.readFileSync("src/index.html", "utf8");
fs.writeFileSync("build/index.html", html, "utf8");

const js = fs.readFileSync("src/scripts.js", "utf8");
const builtJs = js.replace(
  "process.env.GOOGLE_FONTS_API_KEY",
  `"${process.env.GOOGLE_FONTS_API_KEY}"`
);
fs.writeFileSync("build/scripts.js", builtJs, "utf8");
