// Take value between 0 - 1 and get an rgb
const deriveRgbValue = (val: number) => Math.round(val * 255);

//
export function isInt(n: number) {
  return n % 1 === 0;
}

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

type textOptions = {
  x: number;
  y: number;
};

function addText(string: string = "Your new text", options: textOptions): TextNode {
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

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
function buildSample(paintStyle: PaintStyle) {
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

  if (isSingleFill && isSolid) {
    const specStringTest = getRgbStringFromLocalStyle(paintStyle);
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
  const colorStyleTitleText = addText(paintStyleName, {
    x: textX,
    y: sampleY,
  });
  // Build spec
  const colorStyleSpecText = addText(paintStyleSpec, {
    x: textX,
    y: sampleY + 14,
  });

  // Group text nodes
  const textGroup = figma.group([colorStyleTitleText, colorStyleSpecText], figma.currentPage);

  // Selection testing
  // const newNodes: SceneNode[] = [textGroup, colorStyleRect];
  // newNodes.push(textGroup);
  // newNodes.push(colorStyleRect);
  // figma.currentPage.selection = newNodes;
  // console.log("selection", figma.currentPage.selection);
  // console.log("figma", figma);

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

function buildPaintStyleMasterFrame(frameId: string) {
  const paintStylesMasterFrame = figma.getNodeById(frameId) as FrameNode;

  // remove previous children
  paintStylesMasterFrame.children.map((child) => child.remove());

  // new styles
  paintStylesMasterFrame.layoutMode = "VERTICAL";
  paintStylesMasterFrame.counterAxisSizingMode = "AUTO";
  paintStylesMasterFrame.itemSpacing = 16;
  paintStylesMasterFrame.paddingTop = 32;
  paintStylesMasterFrame.paddingRight = 32;
  paintStylesMasterFrame.paddingBottom = 32;
  paintStylesMasterFrame.paddingLeft = 32;
  return paintStylesMasterFrame;
}

function buildPaintStyleFrames(stylesArray: Array<PaintStyle>, masterFrame: FrameNode) {
  let paintStyleFrames = stylesArray.map((x, i) => {
    const paintStyleFrame = buildSample(x);
    paintStyleFrame.y = i * (64 + 16);
    masterFrame.appendChild(paintStyleFrame);
    return paintStyleFrame;
  });
  console.log("paintStyleFrames", paintStyleFrames);

  return paintStyleFrames;
}

function getFrameId() {
  const frameId = figma.root.getPluginData("frameId");
  if (!frameId) {
    const frame = figma.createFrame();
    figma.root.setPluginData("frameId", frame.id);
  }
  return frameId;
}

async function generateLocalPaintStylesDoc() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // create a frame to fill/reuse
  const frameId = getFrameId();

  // Get paint styles
  const localPaintStyles = figma.getLocalPaintStyles();

  // SETUP MASTER ARTBOARD
  const paintStylesMasterFrame = buildPaintStyleMasterFrame(frameId);

  // Add header
  const paintStylesHeader = figma.createText();
  paintStylesHeader.characters = "Paint Styles";
  paintStylesMasterFrame.appendChild(paintStylesHeader);

  // center and zoom to the frame
  figma.viewport.scrollAndZoomIntoView([figma.getNodeById(frameId)]);

  // Build the style frames and append them to the master artboard
  let paintStyleFrames = buildPaintStyleFrames(localPaintStyles, paintStylesMasterFrame);
}

export {
  deriveRgbValue,
  getRgbStringFromLocalStyle,
  buildPaintStyleSpecString,
  buildSample,
  buildPaintStyleMasterFrame,
  buildPaintStyleFrames,
  generateLocalPaintStylesDoc,
};

// Multi fill
// opacity on solid paint fill
// Additional metadata (gradiant type)
// different color modes
// Better visual
// more info on image fill
