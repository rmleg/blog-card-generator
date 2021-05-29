import "regenerator-runtime/runtime";
import { getGoogleFonts, getTopFontsByCategory } from "./scripts";

test("there should be 25 top fonts", async () => {
  /* const data = await getGoogleFonts();
  const topFonts = getTopFontsByCategory(data.items, "serif");
  expect(topFonts.length).toBe(25); */
  // call getGoogleFonts
  // call getTopFontsByCategory
  // result.length should be 25
});

//to test updateFonts: see that there are 25 radio buttons, new ones don't match old ones

//test initSvg - pull defn to top level so I can export it, check that there is an svg with the right elts on the dom
