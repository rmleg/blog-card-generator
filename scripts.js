const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const inputs = document.querySelectorAll("input, textarea");

let width = 300;
let height = 300;

let options = {
  text: "Your Text Here",
  bgColor: "#632b30",
  textColor: "#fefefe",
};

const paintCanvas = (options) => {
  // background
  context.fillStyle = options.bgColor;
  context.fillRect(0, 0, width, height);

  // text
  context.fillStyle = options.textColor;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(options.text, width / 2, height / 2);
};

/* const paintText = (options) => {
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, width / 2, height / 2);
}; */

const updateCanvas = (e) => {
  switch (e.target.name) {
    case "bg-color":
      options.bgColor = e.target.value;
      paintCanvas(options);
      break;
    case "text-color":
      options.textColor = e.target.value;
      paintCanvas(options);
      break;
    case "text":
      options.text = e.target.value;
      paintCanvas(options);
      break;
    default:
      console.log("default case");
  }
};

inputs.forEach((input) => input.addEventListener("change", updateCanvas));

canvas.width = width;
canvas.height = height;

/* context.fillStyle = "#632b30";
context.fillRect(0, 0, width, height); */

paintCanvas(options);
