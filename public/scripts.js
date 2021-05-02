const getGoogleFonts = async () => {
  const results = await fetch(
    "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyCTch8lhPKYVPNhRCi9US9P1TO8ra-c7zc"
  );
  return await results.json();
};

let allFonts = [];
getGoogleFonts().then((data) => {
  const svgContainer = document.querySelector(".svg");
  // const context = canvas.getContext("2d");

  const inputs = document.querySelectorAll("input, textarea");
  const fontSelect = document.querySelector("#font-family-radios");
  fontSelect.addEventListener("change", (e) => {
    if (e.target.value) {
      options.fontFamily = e.target.value;
      drawSvg();
    }
  });

  let options = {
    width: 300,
    height: 300,
    text: ["Your Text Here"],
    bgColor: "#632b30",
    textColor: "#fefefe",
    fontSize: "2em",
    fontType: "display",
  };

  allFonts = data.items;
  const fonts = {
    serif: getTopFontsByCategory("serif"),
    sansSerif: getTopFontsByCategory("sans-serif"),
    handwriting: getTopFontsByCategory("handwriting"),
    monospace: getTopFontsByCategory("monospace"),
    display: getTopFontsByCategory("display"),
  };
  // set default font to most popular display font
  options.fontFamily = fonts.display[0].family;
  // build font api requests for each of the top Display fonts
  // and add them to the head
  fonts.display.forEach((font) => {
    const href = `https://fonts.googleapis.com/css?family=${font.family
      .split(" ")
      .join("+")}`;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "font-family";
    radio.value = font.family;
    radio.id = `font-family-${font.family.split(" ").join("-")}`;
    const label = document.createElement("label");
    label.setAttribute(
      "for",
      `font-family-${font.family.split(" ").join("-")}`
    );
    label.textContent = font.family;
    label.style.fontFamily = font.family;
    fontSelect.appendChild(radio);
    fontSelect.appendChild(label);
  });

  const initSvg = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", options.width);
    svg.setAttribute("height", options.height);
    svg.setAttribute("viewBox", `0 0 ${options.width} ${options.height}`);
    return svg;
  };

  const drawSvg = () => {
    const svg = initSvg();
    const bgRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
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
    text.setAttribute("font-family", options.fontFamily);
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
        break;
      }
      default:
        console.log(e.target.value);
    }
    drawSvg();
  };

  inputs.forEach((input) => input.addEventListener("change", updateSvg));
});

getTopFontsByCategory = (category) => {
  return allFonts
    .filter((font) => {
      return font.category === category;
    })
    .slice(0, 25);
};
