import { addHeaderToFrame, applyStyleFrameStyles, buildStyleFrames, getStoredFrame } from "./helpers";
import { addText } from "./utils";

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
async function buildSample(textStyle: TextStyle) {
  if (!textStyle) {
    return;
  }

  const textStyleName = textStyle.name;
  const textStyleId = textStyle.id;
  let textStyleSpec = "";

  console.log("🎨 ", textStyleName);
  console.log(textStyle);

  // Logic to build spec string
  textStyleSpec += "Roboto | Regular | 12 / Auto";

  function getRangeLineHeightSpecString(lineHeightObject: LineHeight) {
    if (lineHeightObject.unit === "AUTO") {
      return "Auto";
    }
    const unitString = lineHeightObject.unit === "PERCENT" ? "%" : "px";
    const valueString = lineHeightObject.value;
    const specString = `${valueString}${unitString}`;
    return specString;
  }

  let { family: textStyleFontFamily, style: textStyleFontWeight } = textStyle.fontName;
  let textStyleFontSize = textStyle.fontSize;
  let textStyleLineHeight = getRangeLineHeightSpecString(textStyle.lineHeight);

  textStyleSpec = textStyleFontFamily;
  textStyleSpec += " | ";
  textStyleSpec += textStyleFontWeight;
  textStyleSpec += " | ";
  textStyleSpec += textStyleFontSize;
  textStyleSpec += " / ";
  textStyleSpec += textStyleLineHeight;

  // put it here
  const sampleX = 400;
  const sampleY = 0;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  // Build title
  const textStyleTitleText = await addText(textStyleName, {
    x: textX,
    y: sampleY,
  });
  textStyleTitleText.textStyleId = textStyleId;

  // Build spec
  const textStyleSpecText = await addText(textStyleSpec, {
    x: textX,
    y: sampleY + 14,
  });

  // Create the frame, append text + rect, position it
  const sampleFrame = figma.createFrame();
  sampleFrame.appendChild(textStyleTitleText);
  sampleFrame.appendChild(textStyleSpecText);
  sampleFrame.layoutMode = "VERTICAL";
  sampleFrame.itemSpacing = 8;
  sampleFrame.counterAxisSizingMode = "AUTO";
  sampleFrame.counterAxisAlignItems = "MIN";
  sampleFrame.x = sampleX;
  let getSampleFrameWidth = () => sampleFrame.width;
  let sampleFrameWidth = getSampleFrameWidth();

  sampleFrame.resizeWithoutConstraints(sampleFrameWidth, rectSize);

  return sampleFrame;
}

async function generateLocalTextStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get effect styles
  const localTextStyles = figma.getLocalTextStyles();
  console.log("localEffectStyles", localTextStyles);

  // SETUP MASTER ARTBOARD
  const textStylesMasterFrame = applyStyleFrameStyles("TextStylesFrame");
  // Add name; for use in checking for this frames existence
  textStylesMasterFrame.name = "Text Styles";

  // Add header
  await addHeaderToFrame("Text Styles", textStylesMasterFrame);

  // Build the style frames and append them to the master artboard
  await buildStyleFrames<TextStyle>(localTextStyles, textStylesMasterFrame, buildSample);
  //   buildTextStyleFrames(localTextStyles, textStylesMasterFrame);

  // Add style frame to main frame
  // Always the first child
  mainFrame.insertChild(0, textStylesMasterFrame);
}

export { generateLocalTextStylesDoc };
