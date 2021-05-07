const getGoogleFonts = async () => {
  const results = await fetch(
    "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyCTch8lhPKYVPNhRCi9US9P1TO8ra-c7zc"
  );
  return await results.json();
};

// add a download button
// when download button is clicked, draw svg to a new canvas element
// (can the canvas be hidden?)
// then download the canvas as an image

const updateFonts = (fonts, fontType, element) => {
  // clear old links and radios
  const links = document.head.querySelectorAll("link[data-type=font]");
  links.forEach((link) => link.remove());
  element.innerHTML = "";

  // re-add legend
  const legend = document.createElement("legend");
  legend.textContent = "Font family";
  element.appendChild(legend);

  // create and add new links and radios
  fonts[fontType]?.forEach((font) => {
    // create links for head
    const href = `https://fonts.googleapis.com/css?family=${font.family
      .split(" ")
      .join("+")}`;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-type", "font");
    document.head.appendChild(link);

    // create radio buttons for form
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "font-family";
    radio.value = font.family;
    radio.id = `font-family-${font.family.split(" ").join("-")}`;
    if (element.childElementCount === 0) {
      // TODO: check if any radios exist in the element instead
      // this is false because the legend is a child of the element
      radio.checked = true;
    }
    const label = document.createElement("label");
    label.setAttribute(
      "for",
      `font-family-${font.family.split(" ").join("-")}`
    );
    label.textContent = font.family;
    label.style.fontFamily = font.family;
    element.appendChild(radio);
    element.appendChild(label);
  });
};

let allFonts = [];
getGoogleFonts().then((data) => {
  const svgContainer = document.querySelector(".svg");

  const inputs = document.querySelectorAll("input, textarea");
  const fontSelect = document.querySelector(".font-family-radios");

  fontSelect.addEventListener("change", (e) => {
    if (e.target.value) {
      options.fontFamily = e.target.value;
      drawSvg();
    }
  });

  const fontTypeFieldset = document.querySelector(".font-types");
  fontTypeFieldset.addEventListener("change", (e) => {
    if (e.target.value) {
      options.fontType = e.target.value;
      options.fontFamily = fonts[e.target.value][0].family;
      updateFonts(fonts, options.fontType, fontSelect);
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
  console.log(allFonts);
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
  updateFonts(fonts, "display", fontSelect);

  const initSvg = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xmlns-xlink", "http://www.w3.org/1999/xlink");
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

  const getBase64Font = async (fontFamily) => {
    const response = await fetch(
      `https://fonts.googleapis.com/css?family=${fontFamily
        .split(" ")
        .join("+")}`
    );
    const data = await response.text();
    const fontLinkRegex = new RegExp(
      /(https?:\/\/(fonts\.)[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})\w/,
      "ig"
    );
    const [woff] = data.match(fontLinkRegex);

    const woffResponse = await fetch(woff);

    const woffData = await woffResponse.text();

    const contentType = woffResponse.headers.get("Content-Type");

    const base64Data = `data:${contentType};charset=utf-8;base64,${btoa(
      unescape(encodeURIComponent(woffData))
    )}`;

    // console.log("data", data);
    // also need the unicode-range part of data: https://lvngd.com/blog/how-embed-google-font-svg/
    // switch to returning an object with base64 and the unicode range
    return data.replace(woff, base64Data);
  };

  const downloadImage = async () => {
    const svg = document.querySelector("svg");

    const base64Font = await getBase64Font(options.fontFamily);
    console.log("font", base64Font);

    const defs = document.createElement("defs");
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(base64Font));
    // style.textContent = base64Font;
    // style.textContent = base64Font.split("\n").join("");
    defs.appendChild(style);
    svg.insertBefore(defs, svg.firstChild);

    /* const fontEmbedString = `
    @font-face {
      font-family: '${options.fontFamily}';
      font-style: normal;
      font-weight: 400;
      src: url(${base64Font}) format('woff2')}`;

    console.log(fontEmbedString);*/

    // get svg data
    const svgData = new XMLSerializer().serializeToString(svg);

    // make svg base64
    const image64 = `data:image/svg+xml;base64,${btoa(svgData)}`;

    const svgImage = document.createElement("img");
    svgImage.setAttribute("src", image64);

    // set it as the source of the img element

    // const imageBlob = await image.blob();
    // const imageURL = URL.createObjectURL(imageBlob);

    // start keep
    const link = document.createElement("a");
    link.href = svgImage.src;
    link.download = "card";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    svgImage.onload = () => {
      const canvas = document.querySelector("canvas");

      const scaleFactor = window.devicePixelRatio;

      canvas.width = options.width * scaleFactor;
      canvas.height = options.height * scaleFactor;

      canvas.style.width = `${options.width}px`;

      const context = canvas.getContext("2d");
      // draw image in canvas starting left-0 , top - 0
      context.drawImage(
        svgImage,
        0,
        0,
        options.width * scaleFactor,
        options.height * scaleFactor
      );

      document.body.appendChild(svgImage);

      const jpeg = canvas.toDataURL("image/jpeg", 1.0);
      const canvaslink = document.createElement("a");
      canvaslink.download = "card from canvas";
      document.body.appendChild(canvaslink);
      canvaslink.href = jpeg;
      canvaslink.click();
      canvaslink.remove();
    };

    //end keep

    //currently it downloads as an svg without the google font
    //goal: download as a jpeg with the text as an image in the correct font
    //the best option still seems like drawing the image to a canvas
    //possible???
  };

  inputs.forEach((input) => input.addEventListener("change", updateSvg));
  const downloadButton = document.querySelector(".download");
  downloadButton.addEventListener("click", downloadImage);
});

getTopFontsByCategory = (category) => {
  return allFonts
    .filter((font) => {
      return (
        font.category === category && font.family !== "Open Sans Condensed"
      );
    })
    .slice(0, 25);
};
