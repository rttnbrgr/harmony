// Take value between 0 - 1 and get an rgb
export const deriveRgbValue = (val: number) => Math.round(val * 255);

export function isInt(n: number) {
  return n % 1 === 0;
}

type textOptions = {
  x: number;
  y: number;
};

export function addText(string: string = "Your new text", options: textOptions): TextNode {
  const newText = figma.createText();
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

export function addTextNew(string: string = "Your new text"): TextNode {
  const newText = figma.createText();
  newText.characters = string;
  return newText;
}
