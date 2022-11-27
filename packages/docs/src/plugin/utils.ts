import { textOptions } from "./types";

// Take value between 0 - 1 and get an rgb
export const deriveRgbValue = (val: number) => Math.round(val * 255);

export function isInt(n: number) {
  return n % 1 === 0;
}

export async function addText(string: string = "Your new text", options: textOptions): Promise<TextNode> {
  const newText = figma.createText();
  await figma.loadFontAsync(newText.fontName as FontName);
  newText.characters = string;
  if (options.x) {
    newText.x = options.x;
  }
  if (options.y) {
    newText.y = options.y;
  }
  figma.currentPage.appendChild(newText);
  return newText;
}

export function simpleClone(val) {
  return JSON.parse(JSON.stringify(val));
}

// https://stackoverflow.com/questions/11810569/how-to-replace-underscores-with-spaces
export function convertUnderscoresToSpace(str) {
  return str.replace(/_/g, " ");
}

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
