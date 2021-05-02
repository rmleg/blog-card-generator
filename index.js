var static = require("node-static");
var http = require("http");

require("dotenv").config();

var file = new static.Server(`${__dirname}/public`);

const hostname = "127.0.0.1";
const port = 8080;

http
  .createServer(function (req, res) {
    file.serve(req, res);
  })
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
