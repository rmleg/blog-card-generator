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
