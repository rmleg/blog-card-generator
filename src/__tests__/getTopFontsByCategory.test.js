/**
 * @jest-environment jsdom
 */

import { getTopFontsByCategory } from "../scripts";
import { GoogleFontsResponse } from "../testData/GoogleFontsResponse";

test("there should be 25 top fonts", () => {
  const topFonts = getTopFontsByCategory(GoogleFontsResponse.items, "serif");
  expect(topFonts.length).toBe(25);
});

//test initSvg - pull defn to top level so I can export it, check that there is an svg with the right elts on the dom

//test that the first radio button is checked after updateFonts
