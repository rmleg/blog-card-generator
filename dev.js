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

try {
  const html = fs.readFileSync("src/index.html", "utf8");
  fs.writeFileSync("build/index.html", html, "utf8");
} catch (err) {
  console.error(err);
}

try {
  const js = fs.readFileSync("src/scripts.js", "utf8");
  const builtJs = js.replace(
    "process.env.GOOGLE_FONTS_API_KEY",
    `"${process.env.GOOGLE_FONTS_API_KEY}"`
  );
  fs.writeFileSync("build/scripts.js", builtJs, "utf8");
} catch (err) {
  console.error(err);
}

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
