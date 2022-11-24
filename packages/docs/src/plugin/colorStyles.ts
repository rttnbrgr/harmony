import { addHeaderToFrame, applyStyleFrameStyles, buildStyleFrames, getStoredFrame } from "./helpers";
import { deriveRgbValue, isInt, addText } from "./utils";

// get a string from a given paint color
const getRgbStringFromLocalStyle = (style) => {
  // limit to single fill
  const rgbObject = style.paints[0].color;
  const r = deriveRgbValue(rgbObject.r);
  const g = deriveRgbValue(rgbObject.g);
  const b = deriveRgbValue(rgbObject.b);
  return `RGB: [${r}, ${g}, ${b}]`;
};

export function getSpecStringFromColorStop(colorStop: ColorStop): string {
  if (!colorStop) {
    throw new Error("Missing colorStop value");
  }
  let rgbaString = "";
  const r = deriveRgbValue(colorStop.color.r);
  const g = deriveRgbValue(colorStop.color.g);
  const b = deriveRgbValue(colorStop.color.b);
  // get alpha
  const a = colorStop.color.a;
  // get stop
  const position = isInt(colorStop.position) ? colorStop.position : colorStop.position.toFixed(2);
  // rgbaString = `RGBA [${r}, ${g}, ${b}, ${a}] @ ${position}`;
  rgbaString = `[${r}, ${g}, ${b}, ${a}] @ ${position}`;
  return rgbaString;
}

const gradiantReducer = (a, cv) => `${a} -> ${cv}`;

// take a style, return a specString
function buildPaintStyleSpecString(style: PaintStyle): string {
  let specString;
  specString = style.name;
  specString += " - ";
  specString += getRgbStringFromLocalStyle(style);
  console.log(specString);
  return specString;
}

// Get opacity spec string
function getOpacitySpecStringFromSolidPaint(paint: SolidPaint) {
  return paint.opacity === 1 ? "" : `${paint.opacity * 100}%`;
}

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
async function buildSample(paintStyle: PaintStyle) {
  if (!paintStyle) {
    return;
  }
  const paintStyleName = paintStyle.name;
  const paintStyleId = paintStyle.id;
  let paintStyleSpec = "";

  console.log("🎨 ", paintStyleName);
  console.log(paintStyle);

  /*
   * Logic to build spec string
   */

  // safety checking
  let isSolid = true;
  let isSingleFill = true;
  if (paintStyle.paints.length > 1) {
    isSingleFill = false;
    paintStyleSpec = "Multiple Fills";
  }

  let firstPaint = paintStyle.paints[0];

  if (isSingleFill && firstPaint.type !== "SOLID") {
    isSolid = false;

    // For image filles?
    if (firstPaint.type === "IMAGE") {
      paintStyleSpec = `Image fill`;
    }

    // For Gradient fills
    // "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
    if (firstPaint.type !== "IMAGE") {
      // let thisPaintStyle = paintStyle.paints[0];
      console.log("firstPaint", firstPaint);
      // thisPaintStyle.gradientStops.reduce()
      const gradiantStopsString = firstPaint.gradientStops.map(getSpecStringFromColorStop).reduce(gradiantReducer);
      console.log("gradiantStopsString", gradiantStopsString);

      paintStyleSpec = `RGBA: ${gradiantStopsString}`;
    }
  }
  if (isSingleFill && isSolid && "color" in firstPaint) {
    // get color portion of spec
    let specStringTest = getRgbStringFromLocalStyle(paintStyle);
    // get opacity portion of spec
    let opacitySpecString = getOpacitySpecStringFromSolidPaint(firstPaint);
    // Stitch teh spec string together
    if (opacitySpecString) {
      specStringTest += " @ ";
      specStringTest += opacitySpecString;
    }

    console.log("specStringTest", specStringTest);
    paintStyleSpec = specStringTest;
  }

  // put it here
  const sampleX = 400;
  const sampleY = 0;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  // build the rect
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.x = sampleX;
  colorStyleRect.y = sampleY;
  colorStyleRect.fillStyleId = paintStyleId;
  colorStyleRect.resize(rectSize, rectSize);
  colorStyleRect.cornerRadius = spacer;
  figma.currentPage.appendChild(colorStyleRect);

  // Build title
  const colorStyleTitleText = await addText(paintStyleName, {
    x: textX,
    y: sampleY,
  });
  // Build spec
  const colorStyleSpecText = await addText(paintStyleSpec, {
    x: textX,
    y: sampleY + 14,
  });

  // Create the frame, append text + rect, position it
  const sampleFrame = figma.createFrame();
  sampleFrame.appendChild(colorStyleRect);
  sampleFrame.layoutMode = "HORIZONTAL";
  sampleFrame.itemSpacing = 8;
  sampleFrame.counterAxisAlignItems = "CENTER";
  sampleFrame.x = sampleX;

  // Pretty sure this is not necessary; build style frames handles it?
  return Promise.all([colorStyleTitleText, colorStyleSpecText]).then((value) => {
    console.log("colorStyleTitleText promise", value);
    console.log("sampleFrame", sampleFrame);

    // Group text nodes
    const textGroup = figma.group([...value], figma.currentPage);
    console.log("textGroup", textGroup);

    // Sample frame updates, that depend on promises; Append text group
    sampleFrame.appendChild(textGroup);

    // Sample frame size stuff
    let getSampleFrameWidth = () => sampleFrame.width;
    let sampleFrameWidth = getSampleFrameWidth();

    // Resize
    sampleFrame.resizeWithoutConstraints(sampleFrameWidth, rectSize);

    return sampleFrame;
  });
}

async function generateLocalPaintStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get paint styles
  const localPaintStyles = figma.getLocalPaintStyles();

  // SETUP MASTER ARTBOARD
  const paintStylesMasterFrame = applyStyleFrameStyles("ColorStylesFrame");

  // Add header
  await addHeaderToFrame("Color Styles", paintStylesMasterFrame);

  // Build the style frames and append them to the master artboard
  await buildStyleFrames<PaintStyle>(localPaintStyles, paintStylesMasterFrame, buildSample, { x: 64 + 16, y: null });

  // Check if textStyles frame exists
  // This feels brittle
  const textStylesFrameExists = mainFrame.findChildren((x) => {
    console.log("child", x);
    console.log("child name", x.name);
    return x.name === "Text Styles";
  }).length;
  console.log("textStylesFrameExists", textStylesFrameExists);

  // Based on this, set insert position
  const insertPosition = textStylesFrameExists ? 1 : 0;
  console.log("insertPosition", insertPosition);

  // Add style frame to main frame
  // Either at the beginning or after the text styles
  mainFrame.insertChild(insertPosition, paintStylesMasterFrame);
}

export { getRgbStringFromLocalStyle, buildPaintStyleSpecString, buildSample, generateLocalPaintStylesDoc };

// Multi fill
// opacity on solid paint fill
// Additional metadata (gradiant type)
// different color modes
// Better visual
// more info on image fill
