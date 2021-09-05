// Take value between 0 - 1 and get an rgb
export const deriveRgbValue = (val: number) => Math.round(val * 255);

export function isInt(n: number) {
  return n % 1 === 0;
}

export function addText(string: string = "Your new text"): TextNode {
  const newText = figma.createText();
  newText.characters = string;
  return newText;
}
