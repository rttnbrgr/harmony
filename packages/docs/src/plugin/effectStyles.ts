import { deriveRgbValue, isInt, convertUnderscoresToSpace, toTitleCase, addText } from "./utils";

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
