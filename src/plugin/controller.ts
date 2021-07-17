import { buildSample } from "./colorStyles";

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

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

console.log("console", console);
console.log("figma", figma);
// get all colors on the page
// print them with a hex value
// check which ones match a layer style

// Print a string
function buildText(str = "Build Text String", y = 0) {
  console.log("buildText");
  // const newPromise = await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  const TEXT_NODE = figma.createText();
  TEXT_NODE.characters = str;
  TEXT_NODE.y = y;
  figma.currentPage.appendChild(TEXT_NODE);

  console.log("text appended");
}

const defaultRectFills: Array<Paint> = [
  { type: "SOLID", color: { r: 1, g: 0, b: 0.5 } }
];

function buildRect(fills = defaultRectFills, y = 0) {
  const rect = figma.createRectangle();
  rect.x = -20;
  rect.y = y;
  rect.fills = fills;
  rect.resize(10, 10);
  figma.currentPage.appendChild(rect);
  // nodes.push(rect);
}

const deriveRgbValue = val => Math.round(val * 255);
const getRgbStringFromLocalStyle = style => {
  // limit to single fill
  const rgbObject = style.paints[0].color;
  const r = `R: ${deriveRgbValue(rgbObject.r)}`;
  const g = `G: ${deriveRgbValue(rgbObject.g)}`;
  const b = `B: ${deriveRgbValue(rgbObject.b)}`;
  return `[ ${r} ${g} ${b}]`;
};

function buildPaintStyleVisual(style: PaintStyle, verticalOffset: number) {
  let paintStyleString;
  paintStyleString = style.name;
  paintStyleString += " - ";
  paintStyleString += getRgbStringFromLocalStyle(style);
  console.log(paintStyleString);

  buildText(paintStyleString, verticalOffset);
  const paintsClone = clone(style.paints);
  buildRect(paintsClone, verticalOffset);
}

// get all layer styles
const localPaintStyles = figma.getLocalPaintStyles();
console.log("localPaintStyles", localPaintStyles);
// filter by solid]

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

async function loadDefaultFont() {
  console.log("loadDefaultFont");
  const fontPromise = await figma.loadFontAsync({
    family: "Roboto",
    style: "Regular"
  });
  console.log("after font promise");

  // print them
  localPaintStyles.map((x, i) => {
    console.log(i, x);
    let verticalOffset = 20 * i;

    if (i === 5) {
      buildText("Not a solid color", verticalOffset);
      return;
    }

    let string;
    string = x.name;
    string += " - ";
    const deriveRgbValue = val => Math.round(val * 255);
    const getRgbStringFromLocalStyle = style => {
      // limit to single fill
      const rgbObject = style.paints[0].color;
      const r = `R: ${deriveRgbValue(rgbObject.r)}`;
      const g = `G: ${deriveRgbValue(rgbObject.g)}`;
      const b = `B: ${deriveRgbValue(rgbObject.b)}`;
      return `[ ${r} ${g} ${b}]`;
    };
    string += getRgbStringFromLocalStyle(x);
    console.log(string);
    buildText(string, verticalOffset);
    const paintsClone = clone(x.paints);
    buildRect(paintsClone, verticalOffset);
  });
  // with hex
  // with name
  // frame them
  // put them in an auto group
}

// create a sample doc

loadDefaultFont();

const samplePaintStyle = localPaintStyles[1];
console.log("🚨 samplePaintStyle", samplePaintStyle);

const defaultPaintStyleConfig = {};

async function loadingFontsWrapper() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  buildSample(samplePaintStyle);

  // SETUP MASTER ARTBOARD
  const paintStylesMasterFrame = figma.createFrame();
  paintStylesMasterFrame.layoutMode = "VERTICAL";
  paintStylesMasterFrame.counterAxisSizingMode = "AUTO";
  paintStylesMasterFrame.itemSpacing = 16;
  paintStylesMasterFrame.paddingTop = 32;
  paintStylesMasterFrame.paddingRight = 32;
  paintStylesMasterFrame.paddingBottom = 32;
  paintStylesMasterFrame.paddingLeft = 32;

  let paintStyleFrames = localPaintStyles.map((x, i) => {
    const paintStyleFrame = buildSample(x);
    paintStyleFrame.y = i * (64 + 16);
    paintStylesMasterFrame.appendChild(paintStyleFrame);
    return paintStyleFrame;
  });
  console.log("paintStyleFrames", paintStyleFrames);
}

loadingFontsWrapper();
