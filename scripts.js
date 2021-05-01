const svgContainer = document.querySelector(".svg");
// const context = canvas.getContext("2d");

const inputs = document.querySelectorAll("input, textarea");

let options = {
  width: 300,
  height: 300,
  text: ["Your Text Here"],
  bgColor: "#632b30",
  textColor: "#fefefe",
  fontSize: "2em",
};

const initSvg = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", options.width);
  svg.setAttribute("height", options.height);
  svg.setAttribute("viewBox", `0 0 ${options.width} ${options.height}`);
  return svg;
};

const drawSvg = () => {
  const svg = initSvg();
  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("width", "100%");
  bgRect.setAttribute("height", "100%");
  bgRect.setAttribute("fill", options.bgColor);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  options.text.forEach((line) => {
    const tspan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    tspan.setAttribute("x", options.width / 2);
    tspan.setAttribute("dy", "1.25em");
    tspan.textContent = line;
    text.appendChild(tspan);
  });
  text.firstChild.setAttribute("dy", "0.5em");
  text.setAttribute("fill", options.textColor);
  text.setAttribute("font-size", options.fontSize);
  text.setAttribute("x", options.width / 2);
  text.setAttribute("y", options.height / 2);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");

  svg.appendChild(bgRect);
  svg.appendChild(text);

  svgContainer.firstChild
    ? svgContainer.firstChild.replaceWith(svg)
    : svgContainer.appendChild(svg);

  const textOffsetY = (options.height - text.getBBox().height) / 2;
  text.setAttribute("y", textOffsetY);
};

drawSvg();

const updateSvg = (e) => {
  switch (e.target.name) {
    case "bg-color":
      options.bgColor = e.target.value;
      break;
    case "text-color":
      options.textColor = e.target.value;
      break;
    case "text":
      options.text = e.target.value.split("\n");
      break;
    case "width": {
      options.width = e.target.value;
      break;
    }
    case "height": {
      options.height = e.target.value;
      break;
    }
    case "font-size": {
      options.fontSize = `${e.target.value}em`;
    }
    default:
      console.log("default case");
  }
  drawSvg();
};

inputs.forEach((input) => input.addEventListener("change", updateSvg));
