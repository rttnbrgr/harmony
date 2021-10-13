export async function createTextStyle(element) {
  // check if text style exists
  if (element.textStyleId) {
    console.log("textStyle exists", element.textStyleId);
  } else {
    console.log("element", element);
    // create text style
    const textStyle = figma.createTextStyle();
    textStyle.name = element.name;
    if (element.fontName) {
      await figma.loadFontAsync({ family: String(element.fontName), style: "Regular" });
      textStyle.fontName = element.fontName;
    }
    if (element.fontSize) {
      textStyle.fontSize = element.fontSize;
    }
    if (element.letterSpacing) {
      textStyle.letterSpacing = element.letterSpacing;
    }
    if (element.lineHeight) {
      textStyle.lineHeight = element.lineHeight;
    }
    if (element.textCase) {
      textStyle.textCase = element.textCase;
    }
    if (element.textDecoration) {
      textStyle.textDecoration = element.textDecoration;
    }
    console.log("textStyle", textStyle);

    element.textStyleId = textStyle.id;
  }
}
