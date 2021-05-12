const static = require("node-static");
const http = require("http");
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

const file = new static.Server(`${__dirname}/build`);

const hostname = "127.0.0.1";
const port = 8080;

http
  .createServer(function (req, res) {
    file.serve(req, res);
  })
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
