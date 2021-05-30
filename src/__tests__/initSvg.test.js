/**
 * @jest-environment jsdom
 */

import { initSvg } from "../scripts";

test("initSvg should create an svg with the specified width and height", () => {
  const svg = initSvg({ width: 300, height: 300 });
  document.body.appendChild(svg);
  expect(document.querySelector("svg").getAttribute("height")).toBe("300");
  expect(document.querySelector("svg").getAttribute("width")).toBe("300");
});
