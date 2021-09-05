import { deriveRgbValue, isInt } from "./utils";

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
  // return paint.opacity === 1 ? "" : `${combinator}${paint.opacity * 100}%`;
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
  // rgbaString = `RGBA [${r}, ${g}, ${b}, ${a}] @ ${position}`;
  rgbaString = `[${r}, ${g}, ${b}, ${a}] @ ${position}`;
  return rgbaString;
}

export const gradiantReducer = (a, cv) => `${a} -> ${cv}`;

export function getSpecStringFromGradiantPaint(paint: GradientPaint) {
  const gradiantStopsString = paint.gradientStops.map(getSpecStringFromColorStop).reduce(gradiantReducer);
  console.log("gradiantStopsString", gradiantStopsString);
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

export function getSpecString(style: PaintStyle | TextStyle | EffectStyle) {
  let specString = "";
  if (style.type === "TEXT" || style.type === "EFFECT") {
    // currently unsupported
    specString = "Not paint style";
    return specString;
  }
  // Paint styles only, here
  // Logic to build spec string
  let isSingleFill = style.paints.length === 1 ? true : false;

  // if multifill, short circuit
  if (!isSingleFill) {
    specString = "Multiple Fills";
    return specString;
  }

  // For single fills
  let firstPaint = style.paints[0];
  specString = getSpecStringFromPaint(firstPaint);
  return specString;
}
