const static = require("node-static");
const http = require("http");
const fs = require("fs");

require("dotenv").config();

try {
  if (!fs.existsSync("build")) {
    fs.mkdirSync("build");
  }
} catch (err) {
  console.error(err);
}

const filenames = fs.readdirSync("src");

filenames.forEach((filename) => {
  let file = fs.readFileSync(`src/${filename}`, "utf8");
  if (filename === "scripts.js") {
    file = file.replace(
      "process.env.GOOGLE_FONTS_API_KEY",
      `"${process.env.GOOGLE_FONTS_API_KEY}"`
    );
  }
  fs.writeFileSync(`build/${filename}`, file, "utf8");
});

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
