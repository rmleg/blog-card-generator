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
    console.log(base64Data);

    /*
@font-face {
  font-family: 'Bebas Neue';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/bebasneue/v2/JTUSjIg69CK48gW7PXoo9WdhyyTh89ZNpQ.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: 'Bebas Neue';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/bebasneue/v2/JTUSjIg69CK48gW7PXoo9WlhyyTh89Y.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
    */
  };

  const downloadImage = async () => {
    const svg = document.querySelector("svg");

    const base64Font = await getBase64Font(options.fontFamily);

    const image = new Image();
    // get svg data
    const xml = new XMLSerializer().serializeToString(svg);

    // make it base64
    const svg64 = btoa(xml);
    const b64Start = "data:image/svg+xml;base64,";

    // prepend a "header"
    const image64 = b64Start + svg64;

    // set it as the source of the img element
    image.src = image64;

    // const imageBlob = await image.blob();
    // const imageURL = URL.createObjectURL(imageBlob);

    // start keep
    /*     const link = document.createElement("a");
    link.href = image.src;
    link.download = "card";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // image.src = blobURL;
    document.body.appendChild(image);
    console.log(image); */
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
