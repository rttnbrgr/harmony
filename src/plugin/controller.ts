import {
  generateLocalPaintStylesDoc,
  addText,
  deriveRgbValue,
  isInt
} from "./colorStyles";
import { generateLocalEffectStylesDoc } from "./effectStyles";
import { testerFunc } from "./test";

/*
 */
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "create-rectangles") {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "CREATE_COLOR_STYLES") {
    console.log("create color styles");
    generateLocalPaintStylesDoc();
  }

  if (msg.type === "CREATE_EFFECT_STYLES") {
    console.log("create effect styles");
    generateLocalEffectStylesDoc();
  }

  if (msg.type === "CREATE_TEXT_STYLES") {
    console.log("create text styles");
    generateLocalTextStylesDoc();
  }

  if (msg.type === "TESTER") {
    testerFunc();
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

// Global logs
// console.log("console", console);
// console.log("figma", figma);

// Run these automatically when plugin starts
// generateLocalPaintStylesDoc();
// generateLocalEffectStylesDoc();
generateLocalTextStylesDoc();

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

  let { family: textStyleFontFamily, style: textStyleFontWeight } =
    textStyle.fontName;
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
    y: sampleY
  });
  textStyleTitleText.textStyleId = textStyleId;

  // Build spec
  const textStyleSpecText = addText(textStyleSpec, {
    x: textX,
    y: sampleY + 14
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

function buildTextStyleMasterFrame() {
  const paintStylesMasterFrame = figma.createFrame();
  paintStylesMasterFrame.layoutMode = "VERTICAL";
  paintStylesMasterFrame.counterAxisSizingMode = "AUTO";
  paintStylesMasterFrame.itemSpacing = 16;
  paintStylesMasterFrame.paddingTop = 32;
  paintStylesMasterFrame.paddingRight = 32;
  paintStylesMasterFrame.paddingBottom = 32;
  paintStylesMasterFrame.paddingLeft = 32;
  return paintStylesMasterFrame;
}

function buildTextStyleFrames(
  stylesArray: Array<TextStyle>,
  masterFrame: FrameNode
) {
  console.log("inside buildEffectStyleFrames");
  let textStyleFrames = stylesArray.map((x, i) => {
    const textStyleFrame = buildSample(x);
    masterFrame.appendChild(textStyleFrame);
    return textStyleFrame;
  });

  return textStyleFrames;
}

async function generateLocalTextStylesDoc() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get effect styles
  const localTextStyles = figma.getLocalTextStyles();
  console.log("localEffectStyles", localTextStyles);

  // SETUP MASTER ARTBOARD
  const textStylesMasterFrame = buildTextStyleMasterFrame();

  // Add header
  const textStylesHeader = figma.createText();
  textStylesHeader.characters = "Text Styles";
  textStylesMasterFrame.appendChild(textStylesHeader);

  // Build the style frames and append them to the master artboard
  let effectStyleFrames = buildTextStyleFrames(
    localTextStyles,
    textStylesMasterFrame
  );
}
