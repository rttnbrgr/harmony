import { deriveRgbValue, isInt, convertUnderscoresToSpace, toTitleCase } from "./utils";

/********
 *
 *
 * Paint Styles
 *
 */

// get a string from a given paint color
export const getRgbStringFromLocalStyle = (style) => {
  // limit to single fill
  const rgbObject = style.paints[0].color;
  const r = deriveRgbValue(rgbObject.r);
  const g = deriveRgbValue(rgbObject.g);
  const b = deriveRgbValue(rgbObject.b);
  return `RGB: [${r}, ${g}, ${b}]`;
};

export function getSpecStringFromColorStop(colorStop: ColorStop): string {
  if (!colorStop) {
    throw new Error("Missing colorStop value");
  }
  let rgbaString = "";
  const r = deriveRgbValue(colorStop.color.r);
  const g = deriveRgbValue(colorStop.color.g);
  const b = deriveRgbValue(colorStop.color.b);
  // get alpha
  const a = colorStop.color.a;
  // get stop
  const position = isInt(colorStop.position) ? colorStop.position : colorStop.position.toFixed(2);
  // rgbaString = `RGBA [${r}, ${g}, ${b}, ${a}] @ ${position}`;
  rgbaString = `[${r}, ${g}, ${b}, ${a}] @ ${position}`;
  return rgbaString;
}

export const gradiantReducer = (a, cv) => `${a} -> ${cv}`;

// take a style, return a specString
export function buildPaintStyleSpecString(style: PaintStyle): string {
  let specString;
  specString = style.name;
  specString += " - ";
  specString += getRgbStringFromLocalStyle(style);
  console.log(specString);
  return specString;
}

// Get opacity spec string
export function getOpacitySpecStringFromSolidPaint(paint: SolidPaint) {
  return paint.opacity === 1 ? "" : `${paint.opacity * 100}%`;
}

/********
 *
 *
 * Effect Styles
 *
 */

export function getSpecStringFromRgba(color: RGBA) {
  let rgbaString = "";
  const r = deriveRgbValue(color.r);
  const g = deriveRgbValue(color.g);
  const b = deriveRgbValue(color.b);
  const a = isInt(color.a) ? color.a : color.a.toFixed(2);
  rgbaString = `[${r}, ${g}, ${b}, ${a}]`;
  return rgbaString;
}

export function convertEffectTypeToSpecString(str) {
  let specString = str;
  console.log("convertEffectTypeToSpecString", specString);
  specString = convertUnderscoresToSpace(specString);
  console.log(specString);
  specString = toTitleCase(specString);
  console.log(specString);
  return specString;
}
