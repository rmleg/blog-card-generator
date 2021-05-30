/**
 * @jest-environment jsdom
 */

import { getTopFontsByCategory } from "../scripts";
import { GoogleFontsResponse } from "../testData/GoogleFontsResponse";

test("there should be 25 top fonts", () => {
  const topFonts = getTopFontsByCategory(GoogleFontsResponse.items, "serif");
  expect(topFonts.length).toBe(25);
});
