import { deriveRgbValue, isInt, convertUnderscoresToSpace, toTitleCase } from "./utils";

/* ****************
 * Paint Styles
 * ****************/

// get color string from a solid paint
const getColorStringFromSolidPaint = (paint: SolidPaint) => {
  const rgbColor = paint.color;
  const r = deriveRgbValue(rgbColor.r);
  const g = deriveRgbValue(rgbColor.g);
  const b = deriveRgbValue(rgbColor.b);
  return `RGB: [${r}, ${g}, ${b}]`;
};

// Get opacity from a solid paint
function getOpacityStringFromSolidPaint(paint: SolidPaint) {
  const combinator = " @ ";
  return paint.opacity === 1 ? "" : `${paint.opacity * 100}%`;
}

function getSpecStringFromSolidPaint(paint: SolidPaint) {
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

function getSpecStringFromColorStop(colorStop: ColorStop): string {
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

const gradiantReducer = (a, cv) => `${a} -> ${cv}`;

function getSpecStringFromGradiantPaint(paint: GradientPaint) {
  const gradiantStopsString = paint.gradientStops.map(getSpecStringFromColorStop).reduce(gradiantReducer);
  return `RGBA: ${gradiantStopsString}`;
}

function getSpecStringFromPaint(paint: Paint) {
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

function getSpecStringFromTextStyle(textStyle: TextStyle) {
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

/* ****************
 * Effect Styles
 * ****************/

function getSpecStringFromRgba(color: RGBA) {
  let rgbaString = "";
  const r = deriveRgbValue(color.r);
  const g = deriveRgbValue(color.g);
  const b = deriveRgbValue(color.b);
  const a = isInt(color.a) ? color.a : color.a.toFixed(2);
  rgbaString = `[${r}, ${g}, ${b}, ${a}]`;
  return rgbaString;
}

function getEffectTypeSpecStringFromEffect(effect: Effect) {
  let effectType = effect.type;
  let specString = effectType;
  specString = convertUnderscoresToSpace(specString);
  specString = toTitleCase(specString);
  return specString;
}

function getOffsetSpecStringFromEffect(effect: ShadowEffect) {
  let effectOffsetX = effect.offset.x;
  let effectOffsetY = effect.offset.y;
  let specString = `Offset: ${effectOffsetX}, ${effectOffsetY}`;
  return specString;
}

function getSpreadSpecStringFromEffect(effect: ShadowEffect) {
  let spread = effect.spread;
  let specString = `Spread: ${spread}`;
  return specString;
}

function getBlurSpecStringFromEffect(effect: Effect) {
  let radius = effect.radius;
  let specString = `Blur: ${radius}`;
  return specString;
}

function getShadowSpecStringFromEffect(effect: ShadowEffect) {
  // Values
  let effectColor = getSpecStringFromRgba(effect.color);
  let effectOffset = getOffsetSpecStringFromEffect(effect);
  let effectSpread = getSpreadSpecStringFromEffect(effect);
  // Reducer
  let specSeperator = " | ";
  let specReducer = (ac, cv) => ac.concat(specSeperator, cv);
  let specString = [effectColor, effectOffset, effectSpread].reduce(specReducer).concat(specSeperator);
  return specString;
}

function getSpecStringFromEffectStyle(effectStyle: EffectStyle) {
  // Logic to build spec string
  let effectStyleSpec = "";

  let isSingle = effectStyle.effects.length === 1;

  // ignore multi-effect for now
  if (!isSingle) {
    effectStyleSpec = "Multiple Fills";
    return effectStyleSpec;
  }

  let firstEffect = effectStyle.effects[0];
  let firstEffectIsShadow = firstEffect.type === "DROP_SHADOW" || firstEffect.type === "INNER_SHADOW";

  // Effect type
  let effectTypeSpec = getEffectTypeSpecStringFromEffect(firstEffect);

  // Shadow or Blur?
  let shadowEffectSpec = "";
  if ("color" in firstEffect && firstEffectIsShadow) {
    shadowEffectSpec = getShadowSpecStringFromEffect(firstEffect);
  }

  // Blur Radius
  let effectRadius = getBlurSpecStringFromEffect(firstEffect);

  effectStyleSpec = `${effectTypeSpec}: ${shadowEffectSpec}${effectRadius}`;

  return effectStyleSpec;
}

/* ****************
 * All
 * ****************/

export function getSpecString(style: PaintStyle | TextStyle | EffectStyle) {
  let specString = "";

  if (style.type === "TEXT") {
    specString = getSpecStringFromTextStyle(style);
    return specString;
  } else if (style.type === "EFFECT") {
    specString = getSpecStringFromEffectStyle(style);
    return specString;
  } else {
    specString = getSpecStringFromPaintArray(style.paints);
    return specString;
  }
}
