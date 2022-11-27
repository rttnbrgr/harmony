import { deriveRgbValue, isInt, convertUnderscoresToSpace, toTitleCase } from "./utils";

/* ****************
 * Paint Styles
 * ****************/

// get color string from a solid paint
export const getColorStringFromSolidPaint = (paint: SolidPaint) => {
  const rgbColor = paint.color;
  const r = deriveRgbValue(rgbColor.r);
  const g = deriveRgbValue(rgbColor.g);
  const b = deriveRgbValue(rgbColor.b);
  return `RGB: [${r}, ${g}, ${b}]`;
};

// Get opacity from a solid paint
export function getOpacityStringFromSolidPaint(paint: SolidPaint) {
  const combinator = " @ ";
  return paint.opacity === 1 ? "" : `${paint.opacity * 100}%`;
}

export function getSpecStringFromSolidPaint(paint: SolidPaint) {
  // get color portion of spec
  let specStringTest = getColorStringFromSolidPaint(paint);
  // get opacity portion of spec
  let opacitySpecString = getOpacityStringFromSolidPaint(paint);
  // Stitch teh spec string together
  if (opacitySpecString) {
    specStringTest += " @ ";
    specStringTest += opacitySpecString;
  }
  return specStringTest;
}

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
  rgbaString = `[${r}, ${g}, ${b}, ${a}] @ ${position}`;
  return rgbaString;
}

export const gradiantReducer = (a, cv) => `${a} -> ${cv}`;

export function getSpecStringFromGradiantPaint(paint: GradientPaint) {
  const gradiantStopsString = paint.gradientStops.map(getSpecStringFromColorStop).reduce(gradiantReducer);
  return `RGBA: ${gradiantStopsString}`;
}
/**
 *
 * @param paint
 * @returns string
 */
export function getSpecStringFromPaint(paint: Paint) {
  let specString;

  // Image Fills
  if (paint.type === "IMAGE") {
    specString = `Image fill`;
    return specString;
  }
  // Solid Fills
  else if (paint.type === "SOLID") {
    specString = getSpecStringFromSolidPaint(paint as SolidPaint);
    return specString;
  }
  // Gradient Fills
  else {
    specString = getSpecStringFromGradiantPaint(paint as GradientPaint);
    return specString;
  }
}

function getSpecStringFromPaintArray(paintArray: readonly Paint[]) {
  let specString = "";

  // Paint styles only, here
  // Logic to build spec string
  let isSingleFill = paintArray.length === 1 ? true : false;

  // if multifill, short circuit
  if (!isSingleFill) {
    specString = "Multiple Fills";
    return specString;
  }

  // For single fills
  let firstPaint = paintArray[0];
  specString = getSpecStringFromPaint(firstPaint);
  return specString;
}

/* ****************
 * Text Styles
 * ****************/

function getSpecStringFromLineHeight(lineHeightObject: LineHeight) {
  if (lineHeightObject.unit === "AUTO") {
    return "Auto";
  }
  const unitString = lineHeightObject.unit === "PERCENT" ? "%" : "px";
  const valueString = lineHeightObject.value;
  const specString = `${valueString}${unitString}`;
  return specString;
}

export function getSpecStringFromTextStyle(textStyle: TextStyle) {
  let specString = "";

  // Get the pieces
  let { family: textStyleFontFamily, style: textStyleFontWeight } = textStyle.fontName;
  let textStyleFontSize = textStyle.fontSize;
  let textStyleLineHeight = getSpecStringFromLineHeight(textStyle.lineHeight);
  // Assemble
  specString = textStyleFontFamily;
  specString += " | ";
  specString += textStyleFontWeight;
  specString += " | ";
  specString += textStyleFontSize;
  specString += " / ";
  specString += textStyleLineHeight;

  return specString;
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

/********
 *
 *
 * All
 *
 */

export function getSpecString(style: PaintStyle | TextStyle | EffectStyle) {
  let specString = "";

  if (style.type === "TEXT") {
    console.log("TEXT");
    specString = getSpecStringFromTextStyle(style);
    return specString;
  } else if (style.type === "EFFECT") {
    console.log("EFFECT");
    // specString = getSpecStringFromEffectStyle(style);
    return specString;
  } else {
    specString = getSpecStringFromPaintArray(style.paints);
    return specString;
  }
}
