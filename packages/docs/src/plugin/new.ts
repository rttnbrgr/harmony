import {
  getOpacityStringFromSolidPaint,
  getColorStringFromSolidPaint,
  getSpecStringFromSolidPaint,
} from "./colorStyles";

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

export const DOC_BLOCK_ROOT: string = "DocBlockComponent";
export const DOC_BLOCK_SWATCH: string = "DocBlockSwatch";
export const DOC_BLOCK_TITLE: string = "DocBlockTitle";
export const DOC_BLOCK_SPEC: string = "DocBlockSpec";

export function buildComponentStyleSwatch() {
  console.log("👋 buildComponentStyleSwatch", figma.viewport);
  // figma.viewport.center

  /**
   * Config values
   */
  const sampleX = figma.viewport.center.x;
  const sampleY = figma.viewport.center.y;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  /**
   * Build the pieces
   */

  // Build the swatch
  // && put it in the cnter of the page
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.resize(rectSize, rectSize);
  colorStyleRect.cornerRadius = spacer;
  // figma.currentPage.appendChild(colorStyleRect);
  console.log("colorStyleRect", colorStyleRect);

  // Build title
  const TitleText = figma.createText();
  TitleText.characters = "Style Title";

  // Build spec
  const SpecText = figma.createText();
  SpecText.characters = "Style Spec";
  // need to add autolayout
  SpecText.y = 14;

  // create teh text group
  const textGroup = figma.group([TitleText, SpecText], figma.currentPage);

  /**
   * Build the component itself
   */

  // Create it
  const sampleComponent = figma.createComponent();

  // Give it a name
  sampleComponent.name = "Doc Block";
  // Save it
  figma.root.setPluginData(DOC_BLOCK_ROOT, sampleComponent.id);

  // Add component children
  sampleComponent.appendChild(colorStyleRect);
  sampleComponent.appendChild(textGroup);

  // Save teh children refs
  sampleComponent.setPluginData(DOC_BLOCK_SWATCH, colorStyleRect.id);
  sampleComponent.setPluginData(DOC_BLOCK_TITLE, TitleText.id);
  sampleComponent.setPluginData(DOC_BLOCK_SPEC, SpecText.id);

  // Component Config Opinions
  sampleComponent.layoutMode = "HORIZONTAL";
  sampleComponent.itemSpacing = 8;
  sampleComponent.counterAxisAlignItems = "CENTER";
  sampleComponent.x = sampleX;
  let getSampleFrameWidth = () => sampleComponent.width;
  let sampleFrameWidth = getSampleFrameWidth();

  sampleComponent.resizeWithoutConstraints(sampleFrameWidth, rectSize);
  // console.log("sampleFrame", sampleFrame);
}

/**
 * setup a new build sample func
 */

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
export function createColorStyleDocBlockInstance(paintStyle: PaintStyle) {
  if (!paintStyle) {
    console.log("🚨 Not a paint style");
    return;
  }
  console.log("👇 createColorStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  /**
   * Destruct the important values from the paintStyle
   */

  // const paintStyleName = paintStyle.name;
  // const paintStyleId = paintStyle.id;
  // let paintStyleSpec = "";
  const { name: paintStyleName, id: paintStyleId, paints } = paintStyle;
  console.log("🎨 ", paintStyleName, paintStyleId);
  let paintStyleSpec = "";
  // console.log(paintStyle);

  /*
   * Logic to build spec string
   */

  // safety checking
  let isSolid = true;
  let isSingleFill = paintStyle.paints.length === 1 ? true : false;

  // if multifill, short circuit
  if (!isSingleFill) {
    paintStyleSpec = "Multiple Fills";
    // short circuit
    // return paintStyleSpec;
  }

  let firstPaint = paints[0];

  // Image Fills
  if (firstPaint.type === "IMAGE") {
    paintStyleSpec = `Image fill`;
    // return paintStyleSpec;
  }
  // Solid Fills
  else if (firstPaint.type === "SOLID") {
    // // get color portion of spec
    // let specStringTest = getRgbStringFromSolidPaint(firstPaint);
    // // get opacity portion of spec
    // let opacitySpecString = getOpacitySpecStringFromSolidPaint(firstPaint);
    // // Stitch teh spec string together
    // if (opacitySpecString) {
    //   specStringTest += " @ ";
    //   specStringTest += opacitySpecString;
    // }
    // paintStyleSpec = `Solid Fill`;
    // paintStyleSpec = specStringTest;
    paintStyleSpec = getSpecStringFromSolidPaint(firstPaint);
    // return paintStyleSpec;
  } else {
    /**
     * For Gradient fills
     * ---
     * "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
     */
    paintStyleSpec = `Gradient Fill`;
    // return paintStyleSpec;
  }

  // if (isSingleFill && firstPaint.type !== "SOLID") {
  //   isSolid = false;

  //   // For Gradient fills
  //   // "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
  //   if (firstPaint.type !== "IMAGE") {
  //     // let thisPaintStyle = paintStyle.paints[0];
  //     console.log("firstPaint", firstPaint);
  //     // thisPaintStyle.gradientStops.reduce()
  //     const gradiantStopsString = firstPaint.gradientStops.map(getSpecStringFromColorStop).reduce(gradiantReducer);
  //     console.log("gradiantStopsString", gradiantStopsString);

  //     paintStyleSpec = `RGBA: ${gradiantStopsString}`;
  //   }
  // }

  // // put it here
  // const sampleX = 400;
  // const sampleY = 0;
  // const spacer = 8;
  // const rectSize = spacer * 8;
  // const textX = sampleX + rectSize + spacer;

  // // build the rect
  // const colorStyleRect = figma.createRectangle();
  // colorStyleRect.x = sampleX;
  // colorStyleRect.y = sampleY;
  // colorStyleRect.fillStyleId = paintStyleId;
  // colorStyleRect.resize(rectSize, rectSize);
  // colorStyleRect.cornerRadius = spacer;
  // figma.currentPage.appendChild(colorStyleRect);

  // // Build title
  // const colorStyleTitleText = addText(paintStyleName, {
  //   x: textX,
  //   y: sampleY,
  // });
  // // Build spec
  // const colorStyleSpecText = addText(paintStyleSpec, {
  //   x: textX,
  //   y: sampleY + 14,
  // });

  // // Group text nodes
  // const textGroup = figma.group([colorStyleTitleText, colorStyleSpecText], figma.currentPage);

  // // Selection testing
  // // const newNodes: SceneNode[] = [textGroup, colorStyleRect];
  // // newNodes.push(textGroup);
  // // newNodes.push(colorStyleRect);
  // // figma.currentPage.selection = newNodes;
  // // console.log("selection", figma.currentPage.selection);
  // // console.log("figma", figma);

  // // Create the frame, append text + rect, position it
  // const sampleFrame = figma.createFrame();
  // sampleFrame.appendChild(colorStyleRect);
  // sampleFrame.appendChild(textGroup);
  // sampleFrame.layoutMode = "HORIZONTAL";
  // sampleFrame.itemSpacing = 8;
  // sampleFrame.counterAxisAlignItems = "CENTER";
  // sampleFrame.x = sampleX;
  // let getSampleFrameWidth = () => sampleFrame.width;
  // let sampleFrameWidth = getSampleFrameWidth();

  // sampleFrame.resizeWithoutConstraints(sampleFrameWidth, rectSize);
  // // console.log("sampleFrame", sampleFrame);

  // return sampleFrame;
  console.log("spec:", paintStyleSpec);
  console.log("👆 end createColorStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");
}
