/**
 * @jest-environment jsdom
 */

import { getTopFontsByCategory, updateFonts } from "../scripts";
import { GoogleFontsResponse } from "../testData/GoogleFontsResponse";
import { screen } from "@testing-library/dom";

const fonts = {
  serif: getTopFontsByCategory(GoogleFontsResponse.items, "serif"),
  sansSerif: getTopFontsByCategory(GoogleFontsResponse.items, "sans-serif"),
  handwriting: getTopFontsByCategory(GoogleFontsResponse.items, "handwriting"),
  monospace: getTopFontsByCategory(GoogleFontsResponse.items, "monospace"),
  display: getTopFontsByCategory(GoogleFontsResponse.items, "display"),
};

test("updateFonts should create 25 link elements", () => {
  document.body.innerHTML = `
      <div data-testid="radio-button-container"></div>
    `;
  updateFonts(fonts, "serif", screen.getByTestId("radio-button-container"));
  expect(document.querySelectorAll("link[data-type=font]").length).toBe(25);
});

test("updateFonts should create 25 radio buttons", () => {
  document.body.innerHTML = `
      <div data-testid="radio-button-container"></div>
    `;
  updateFonts(fonts, "serif", screen.getByTestId("radio-button-container"));
  expect(document.querySelectorAll("input").length).toBe(25);
});

test("updateFonts should check the first radio button", () => {
  document.body.innerHTML = `
      <div data-testid="radio-button-container"></div>
    `;

  updateFonts(fonts, "serif", screen.getByTestId("radio-button-container"));
  expect(document.querySelectorAll("input")[0].checked).toBeTruthy();
});
