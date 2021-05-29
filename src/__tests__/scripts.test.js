/**
 * @jest-environment jsdom
 */

import "regenerator-runtime/runtime";
import { getTopFontsByCategory } from "../scripts";
import { GoogleFontsResponse } from "../testData/GoogleFontsResponse";
import { screen } from "@testing-library/dom";

/* const getGoogleFonts = jest.fn(() => {
  return GoogleFontsResponse.items;
}); */

test("there should be 25 top fonts", () => {
  const topFonts = getTopFontsByCategory(GoogleFontsResponse.items, "serif");
  expect(topFonts.length).toBe(25);
});

test("uses jest-dom", () => {
  document.body.innerHTML = `
  <span data-testid="not-empty"><span data-testid="empty"></span></span>
  <span data-testid="with-whitespace"> </span>
  <span data-testid="with-comment"><!-- comment --></span>
  `;

  expect(screen.getByTestId("empty")).toBeEmptyDOMElement();
  expect(screen.getByTestId("not-empty")).not.toBeEmptyDOMElement();
  expect(screen.getByTestId("with-whitespace")).not.toBeEmptyDOMElement();
});

//to test updateFonts: see that there are 25 radio buttons, new ones don't match old ones

//test initSvg - pull defn to top level so I can export it, check that there is an svg with the right elts on the dom
