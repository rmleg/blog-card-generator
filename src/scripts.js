/**TODO for MVP:
 * design
 * pull out node stuff
 * figure out deploying to netlify with parcel
 *
 * TODO for future:
 * accessibility guidelines/hints re contrast, alt text
 */
const GOOGLE_FONTS_API_KEY = process.env.GOOGLE_FONTS_API_KEY;

export const getGoogleFonts = async () => {
  const results = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${GOOGLE_FONTS_API_KEY}`
  );
  return await results.json();
};

export const getTopFontsByCategory = (allFonts, category) => {
  return allFonts
    .filter((font) => {
      return (
        font.category === category && font.family !== "Open Sans Condensed"
      );
    })
    .slice(0, 25);
};

const updateFonts = (fonts, fontType, element) => {
  // clear old links and radios
  const links = document.head.querySelectorAll("link[data-type=font]");
  links.forEach((link) => link.remove());
  element.innerHTML = "";

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
    const div = document.createElement("div");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "font-family";
    radio.value = font.family;
    radio.id = `font-family-${font.family.split(" ").join("-")}`;
    if (element.childElementCount === 1) {
      // if only a legend exists in the fieldset, this is the first radio
      radio.checked = true;
    }
    const label = document.createElement("label");
    label.setAttribute(
      "for",
      `font-family-${font.family.split(" ").join("-")}`
    );
    label.textContent = font.family;
    label.style.fontFamily = font.family;
    div.appendChild(radio);
    div.appendChild(label);
    element.appendChild(div);
  });
};

const initSvg = (options) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xmlns-xlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute("width", options.width);
  svg.setAttribute("height", options.height);
  svg.setAttribute("viewBox", `0 0 ${options.width} ${options.height}`);
  return svg;
};

const drawSvg = (options, container) => {
  const svg = initSvg(options);
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
  text.setAttribute("font-family", options.fontFamily);
  text.setAttribute("x", options.width / 2);
  text.setAttribute("y", options.height / 2);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");

  svg.appendChild(bgRect);
  svg.appendChild(text);

  container.firstChild
    ? container.firstChild.replaceWith(svg)
    : container.appendChild(svg);

  const textOffsetY = (options.height - text.getBBox().height) / 2;
  text.setAttribute("y", textOffsetY);
};

const updateSvg = (e, options, container) => {
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
      break;
  }
  drawSvg(options, container);
};

const getFontRule = (rule) => {
  const src =
    rule.style.getPropertyValue("src") ||
    rule.style.cssText.match(/url\(.*?\)/g)[0];
  if (!src) {
    return null;
  }

  const url = src.split("url(")[1].split(")")[0];
  return {
    rule: rule,
    src: src,
    url: url.replace(/\"/g, ""),
  };
};

const getFontDataURL = async (url) => {
  const response = await fetch(url);
  const responseBlob = await response.blob();
  const f = new FileReader();
  return new Promise((resolve, reject) => {
    f.onerror = () => {
      f.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    f.onload = () => {
      resolve(f.result);
    };
    f.readAsDataURL(responseBlob);
  });
};

const GFontToDataURI = async (url) => {
  /* Big thanks to this stackoverflow answer!!! https://stackoverflow.com/a/42405731 */
  const response = await fetch(url);
  const data = await response.text();

  const styles = document.createElement("style");
  styles.innerHTML = data;
  document.head.appendChild(styles);
  const stylesheet = styles.sheet;
  const ruleList = stylesheet.cssRules;

  let fontRules = [];
  let fontRule;

  for (let i = 0; i < ruleList.length; i += 1) {
    fontRule = getFontRule(ruleList[i]);
    if (fontRule) {
      try {
        const dataURL = await getFontDataURL(fontRule.url);
        fontRules.push(fontRule.rule.cssText.replace(fontRule.url, dataURL));
      } catch (e) {
        console.warn(e.message);
      }
    }
  }

  document.head.removeChild(styles);
  return fontRules;
};

const downloadImage = async (options, type) => {
  const svg = document.querySelector("svg");

  const cssRules = await GFontToDataURI(
    `https://fonts.googleapis.com/css?family=${options.fontFamily
      .split(" ")
      .join("+")}`
  );

  let svgNS = "http://www.w3.org/2000/svg";
  // so let's append it in our svg node
  let defs = document.createElementNS(svgNS, "defs");
  let style = document.createElementNS(svgNS, "style");
  style.innerHTML = cssRules.join("\n");
  defs.appendChild(style);
  svg.insertBefore(defs, svg.firstChild);

  // get svg data
  const svgData = new XMLSerializer().serializeToString(svg);

  // make svg base64
  const image64 = `data:image/svg+xml;base64,${btoa(svgData)}`;

  const svgImage = document.createElement("img");
  svgImage.setAttribute("src", image64);

  if (type === "svg") {
    const link = document.createElement("a");
    link.href = svgImage.src;
    link.download = `${options.text.join(" ")} card`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    svgImage.onload = () => {
      const canvas = document.createElement("canvas");

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

      const jpeg = canvas.toDataURL("image/jpeg", 1.0);
      const canvaslink = document.createElement("a");
      canvaslink.download = `${options.text.join(" ")} card`;
      document.body.appendChild(canvaslink);
      canvaslink.href = jpeg;
      canvaslink.click();
      canvaslink.remove();
    };
  }
};

let allFonts = [];
getGoogleFonts().then((data) => {
  //set default options
  let options = {
    width: 300,
    height: 300,
    text: ["Your Text Here"],
    bgColor: "#47304F",
    textColor: "#fefefe",
    fontSize: "2em",
    fontType: "display",
  };

  const svgContainer = document.querySelector(".svg");

  const inputs = document.querySelectorAll("input, textarea");
  const fontSelect = document.querySelector(".font-family-radios__container");

  fontSelect.addEventListener("change", (e) => {
    if (e.target.value) {
      options.fontFamily = e.target.value;
      drawSvg(options, svgContainer);
    }
  });

  const fontTypeFieldset = document.querySelector(".font-types");
  fontTypeFieldset.addEventListener("change", (e) => {
    if (e.target.value) {
      options.fontType = e.target.value;
      options.fontFamily = fonts[e.target.value][0].family;
      updateFonts(fonts, options.fontType, fontSelect);
      drawSvg(options, svgContainer);
    }
  });

  allFonts = data.items;
  const fonts = {
    serif: getTopFontsByCategory(allFonts, "serif"),
    sansSerif: getTopFontsByCategory(allFonts, "sans-serif"),
    handwriting: getTopFontsByCategory(allFonts, "handwriting"),
    monospace: getTopFontsByCategory(allFonts, "monospace"),
    display: getTopFontsByCategory(allFonts, "display"),
  };
  // set default font to most popular serif font
  options.fontFamily = fonts.serif[0].family;
  // build font api requests for each of the top Serif fonts
  // and add them to the head
  updateFonts(fonts, "serif", fontSelect);

  drawSvg(options, svgContainer);

  inputs.forEach((input) =>
    input.addEventListener("change", (e) => updateSvg(e, options, svgContainer))
  );
  const downloadSVGButton = document.querySelector(".download-svg");
  downloadSVGButton.addEventListener("click", () =>
    downloadImage(options, "svg")
  );
  const downloadJPGButton = document.querySelector(".download-jpg");
  downloadJPGButton.addEventListener("click", () =>
    downloadImage(options, "jpg")
  );
});
