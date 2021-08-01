import { addText } from "./colorStyles";
import { getStoredFrame } from "./helpers";

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
function buildSample(textStyle: TextStyle) {
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
  const textStyleTitleText = addText(textStyleName, {
    x: textX,
    y: sampleY,
  });
  textStyleTitleText.textStyleId = textStyleId;

  // Build spec
  const textStyleSpecText = addText(textStyleSpec, {
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

function buildTextStyleMasterFrame(paintStylesMasterFrame: FrameNode) {
  paintStylesMasterFrame.layoutMode = "VERTICAL";
  paintStylesMasterFrame.counterAxisSizingMode = "AUTO";
  paintStylesMasterFrame.itemSpacing = 16;
  paintStylesMasterFrame.paddingTop = 32;
  paintStylesMasterFrame.paddingRight = 32;
  paintStylesMasterFrame.paddingBottom = 32;
  paintStylesMasterFrame.paddingLeft = 32;
  return paintStylesMasterFrame;
}

function buildTextStyleFrames(stylesArray: Array<TextStyle>, masterFrame: FrameNode) {
  console.log("inside buildEffectStyleFrames");
  let textStyleFrames = stylesArray.map((x, i) => {
    const textStyleFrame = buildSample(x);
    masterFrame.appendChild(textStyleFrame);
    return textStyleFrame;
  });

  return textStyleFrames;
}

async function generateLocalTextStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // create a frame to fill/reuse
  const frame = getStoredFrame("TextStylesFrame") as FrameNode;

  // Get effect styles
  const localTextStyles = figma.getLocalTextStyles();
  console.log("localEffectStyles", localTextStyles);

  // SETUP MASTER ARTBOARD
  const textStylesMasterFrame = buildTextStyleMasterFrame(frame);

  // Add header
  const textStylesHeader = figma.createText();
  textStylesHeader.characters = "Text Styles";
  textStylesMasterFrame.appendChild(textStylesHeader);

  // Build the style frames and append them to the master artboard
  let effectStyleFrames = buildTextStyleFrames(localTextStyles, textStylesMasterFrame);
  mainFrame.appendChild(textStylesMasterFrame);
}

export { generateLocalTextStylesDoc };
