// Take value between 0 - 1 and get an rgb
const deriveRgbValue = val => Math.round(val * 255);

// get a string from a given paint color
const getRgbStringFromLocalStyle = style => {
  // limit to single fill
  const rgbObject = style.paints[0].color;
  const r = `R: ${deriveRgbValue(rgbObject.r)}`;
  const g = `G: ${deriveRgbValue(rgbObject.g)}`;
  const b = `B: ${deriveRgbValue(rgbObject.b)}`;
  return `[ ${r} ${g} ${b} ]`;
};

// take a style, return a specString
function buildPaintStyleSpecString(style: PaintStyle) {
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

function addText(string: string = "Your new text", options: textOptions) {
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
  console.log("🗞 buildSample");
  // get paint style things

  if (!paintStyle) {
    return;
  }
  const paintStyleName = paintStyle.name;
  const paintStyleId = paintStyle.id;
  // safety checking
  let isSolid = true;
  let isSingleFill = true;
  if (paintStyle.paints.length > 1) {
    isSingleFill = false;
  }
  if (isSingleFill && paintStyle.paints[0].type !== "SOLID") {
    isSolid = false;
  }

  // put it here
  const sampleX = 400;
  const sampleY = 0;
  const spacer = 8;
  const rectSize = spacer * 8;
  const styleSpec = "RGB: 255, 127, 0";
  const textX = sampleX + rectSize + spacer;

  console.log("🎨 ", paintStyleName);
  console.log(paintStyle);

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
    y: sampleY
  });
  // Build spec
  const colorStyleSpecText = addText(styleSpec, {
    x: textX,
    y: sampleY + 14
  });

  // Group text nodes
  const textGroup = figma.group(
    [colorStyleTitleText, colorStyleSpecText],
    figma.currentPage
  );

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
  console.log("sampleFrame", sampleFrame);

  return sampleFrame;
}

function buildPaintStyleMasterFrame() {
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

function buildPaintStyleFrames(
  stylesArray: Array<PaintStyle>,
  masterFrame: FrameNode
) {
  let paintStyleFrames = stylesArray.map((x, i) => {
    const paintStyleFrame = buildSample(x);
    paintStyleFrame.y = i * (64 + 16);
    masterFrame.appendChild(paintStyleFrame);
    return paintStyleFrame;
  });
  console.log("paintStyleFrames", paintStyleFrames);

  return paintStyleFrames;
}

async function generateLocalPaintStylesDoc() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get paint styles
  const localPaintStyles = figma.getLocalPaintStyles();

  // SETUP MASTER ARTBOARD
  const paintStylesMasterFrame = buildPaintStyleMasterFrame();

  // Build the style frames and append them to the master artboard
  let paintStyleFrames = buildPaintStyleFrames(
    localPaintStyles,
    paintStylesMasterFrame
  );
}

export {
  deriveRgbValue,
  getRgbStringFromLocalStyle,
  buildPaintStyleSpecString,
  buildSample,
  buildPaintStyleMasterFrame,
  buildPaintStyleFrames,
  generateLocalPaintStylesDoc
};
