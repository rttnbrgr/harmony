import {
  getOpacitySpecStringFromSolidPaint,
  getRgbStringFromLocalStyle,
  getSpecStringFromColorStop,
  gradiantReducer,
} from "./getSpec";
import { addText } from "./utils";

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
export async function buildColorStyleBlock(paintStyle: PaintStyle) {
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
