import {
  generateLocalPaintStylesDoc,
  addText,
  deriveRgbValue,
  isInt
} from "./colorStyles";
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
generateLocalEffectStylesDoc();

// get all colors on the page
// print them with a hex value
// check which ones match a layer style

function getSpecStringFromRgba(color: RGBA) {
  let rgbaString = "";
  const r = deriveRgbValue(color.r);
  const g = deriveRgbValue(color.g);
  const b = deriveRgbValue(color.b);
  const a = isInt(color.a) ? color.a : color.a.toFixed(2);
  rgbaString = `[${r}, ${g}, ${b}, ${a}]`;
  return rgbaString;
}

function convertUnderscoresToSpace(str) {
  return str.replace(/_/g, " ");
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function convertEffectTypeToSpecString(str) {
  let specString = str;
  console.log("convertEffectTypeToSpecString", specString);
  specString = convertUnderscoresToSpace(specString);
  console.log(specString);
  specString = toTitleCase(specString);
  console.log(specString);
  return specString;
}

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
function buildSample(effectStyle: EffectStyle) {
  if (!effectStyle) {
    return;
  }

  const effectStyleName = effectStyle.name;
  const effectStyleId = effectStyle.id;
  let effectStyleSpec = "";

  console.log("🎨 ", effectStyleName);
  console.log(effectStyle);

  // Logic to build spec string

  // safety checking
  let isSolid = true;
  let isSingle = true;

  // ignore multi-effect for now
  if (effectStyle.effects.length > 1) {
    isSingle = false;
    effectStyleSpec = "Multiple Fills";
    console.log("multi effect");
  }

  let firstEffect = effectStyle.effects[0];

  if (isSingle) {
    // Effect type
    let effectType = firstEffect.type;
    let effectTypeString = convertEffectTypeToSpecString(effectType);
    effectStyleSpec += effectTypeString;
    effectStyleSpec += ": ";

    // Shadow or Blur?
    if (effectType === "DROP_SHADOW" || effectType === "INNER_SHADOW") {
      // Effect color
      let effectColor = getSpecStringFromRgba(firstEffect.color);
      effectStyleSpec += effectColor;
      effectStyleSpec += " | ";
      // Offset
      let effectOffsetX = firstEffect.offset.x;
      let effectOffsetY = firstEffect.offset.y;
      effectStyleSpec += "Offset: ";
      effectStyleSpec += effectOffsetX;
      effectStyleSpec += ", ";
      effectStyleSpec += effectOffsetY;
      effectStyleSpec += " | ";
      // Spread
      let effectSpread = firstEffect.spread;
      effectStyleSpec += "Spread: ";
      effectStyleSpec += effectSpread;
      effectStyleSpec += " | ";
    } else {
      console.log("blur effect");
    }
    // Blur Radius
    let effectRadius = firstEffect.radius;
    effectStyleSpec += "Blur: ";
    effectStyleSpec += effectRadius;
  }

  /** 

  if (isSingle && firstEffect.type !== "SOLID") {
    isSolid = false;

    // For image filles?
    if (firstEffect.type === "IMAGE") {
      effectStyleSpec = `Image fill`;
    }

    // For Gradient fills
    // "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
    if (firstEffect.type !== "IMAGE") {
      // let thisPaintStyle = paintStyle.paints[0];
      console.log("firstPaint", firstEffect);
      // thisPaintStyle.gradientStops.reduce()
      const gradiantStopsString = firstEffect.gradientStops
        .map(getSpecStringFromColorStop)
        .reduce(gradiantReducer);
      console.log("gradiantStopsString", gradiantStopsString);

      effectStyleSpec = `RGBA: ${gradiantStopsString}`;
    }
  }

  if (isSingle && isSolid) {
    const specStringTest = getRgbStringFromLocalStyle(effectStyle);
    console.log("specStringTest", specStringTest);
    effectStyleSpec = specStringTest;
  }
  */

  // put it here
  const sampleX = 400;
  const sampleY = 0;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  const whiteFill: Array<SolidPaint> = [
    {
      type: "SOLID",
      color: {
        r: 1,
        g: 1,
        b: 1
      }
    }
  ];

  // build the rect
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.x = sampleX;
  colorStyleRect.y = sampleY;
  colorStyleRect.fills = whiteFill;
  colorStyleRect.effectStyleId = effectStyleId;
  colorStyleRect.resize(rectSize, rectSize);
  colorStyleRect.cornerRadius = spacer;
  figma.currentPage.appendChild(colorStyleRect);

  // Build title
  const colorStyleTitleText = addText(effectStyleName, {
    x: textX,
    y: sampleY
  });
  // Build spec
  const colorStyleSpecText = addText(effectStyleSpec, {
    x: textX,
    y: sampleY + 14
  });

  // Group text nodes
  const textGroup = figma.group(
    [colorStyleTitleText, colorStyleSpecText],
    figma.currentPage
  );

  // Create the frame, append text + rect, position it
  const sampleFrame = figma.createFrame();
  sampleFrame.appendChild(colorStyleRect);
  sampleFrame.appendChild(textGroup);
  sampleFrame.layoutMode = "HORIZONTAL";
  sampleFrame.itemSpacing = 8;
  sampleFrame.counterAxisAlignItems = "CENTER";
  sampleFrame.x = sampleX;
  let getSampleFrameWidth = () => sampleFrame.width;
  let sampleFrameWidth = getSampleFrameWidth();

  sampleFrame.resizeWithoutConstraints(sampleFrameWidth, rectSize);
  // console.log("sampleFrame", sampleFrame);

  return sampleFrame;
}

function buildEffectStyleMasterFrame() {
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

function buildEffectStyleFrames(
  stylesArray: Array<EffectStyle>,
  masterFrame: FrameNode
) {
  console.log("inside buildEffectStyleFrames");
  let effectStyleFrames = stylesArray.map((x, i) => {
    const effectStyleFrame = buildSample(x);
    effectStyleFrame.y = i * (64 + 16);
    masterFrame.appendChild(effectStyleFrame);
    return effectStyleFrame;
    // console.log("effectStyle ", i, ": ", x);
  });
  // console.log("effectStyleFrames", effectStyleFrames);

  return effectStyleFrames;
}

async function generateLocalEffectStylesDoc() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get effect styles
  const localEffectStyles = figma.getLocalEffectStyles();
  console.log("localEffectStyles", localEffectStyles);

  // SETUP MASTER ARTBOARD
  const effectStylesMasterFrame = buildEffectStyleMasterFrame();

  // Add header
  const effectStylesHeader = figma.createText();
  effectStylesHeader.characters = "Effect Styles";
  effectStylesMasterFrame.appendChild(effectStylesHeader);

  /*
   */

  console.log("before buildEffectStyleFrames");

  // Build the style frames and append them to the master artboard
  let effectStyleFrames = buildEffectStyleFrames(
    localEffectStyles,
    effectStylesMasterFrame
  );
}
