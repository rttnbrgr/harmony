import {
  getOpacityStringFromSolidPaint,
  getColorStringFromSolidPaint,
  getSpecStringFromSolidPaint,
  getSpecStringFromGradiantPaint,
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
  console.log("TitleText", TitleText);
  console.log("TitleText ID", TitleText.id);

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
  const test = sampleComponent.getPluginData(DOC_BLOCK_TITLE);
  console.log("test", test);
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
 *
 * @param paint
 * @returns string
 */
function getSpecStringFromPaint(paint: Paint) {
  let specString;

  // Image Fills
  if (paint.type === "IMAGE") {
    specString = `Image fill`;
    return specString;
  }
  // Solid Fills
  else if (paint.type === "SOLID") {
    specString = getSpecStringFromSolidPaint(paint as SolidPaint);
    return specString;
  }
  // Gradient Fills
  else {
    specString = getSpecStringFromGradiantPaint(paint as GradientPaint);
    return specString;
  }
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

  if (isSingleFill) {
    let firstPaint = paints[0];
    paintStyleSpec = getSpecStringFromPaint(firstPaint);
  }

  console.log("spec:", paintStyleSpec);
  console.log("👆 end createColorStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  // At this point, we have our spec, name, and id

  /**
   * Get all the references from the root component instance
   */

  // Get id
  const DocBlockId = figma.root.getPluginData(DOC_BLOCK_ROOT);
  // Get global ref
  const DocBlockComponentMaster = figma.getNodeById(DocBlockId) as ComponentNode;
  // Get refs
  const DocBlockSwatch = DocBlockComponentMaster.getPluginData(DOC_BLOCK_SWATCH);
  const DocBlockTitle = DocBlockComponentMaster.getPluginData(DOC_BLOCK_TITLE);
  const DocBlockSpec = DocBlockComponentMaster.getPluginData(DOC_BLOCK_SPEC);
  console.log("DocBlockId", DocBlockId);
  console.log("DocBlockSwatch", DocBlockSwatch);
  console.log("DocBlockTitle", DocBlockTitle);
  console.log("DocBlockSpec", DocBlockSpec);

  /**
   * Create and update instance
   */
  // Create instance
  const DocBlockComponentInstance = DocBlockComponentMaster.createInstance();
  DocBlockComponentInstance.y = 200;

  // Get swatch
  let swatch = DocBlockComponentInstance.findChild((node) => {
    return node.id.endsWith(DocBlockSwatch);
  }) as RectangleNode;
  // Apply swatch
  swatch.fillStyleId = paintStyleId;

  // Get name
  let title = DocBlockComponentInstance.findOne((node) => {
    return node.id.endsWith(DocBlockTitle);
  }) as TextNode;
  console.log("title", title);
  // Apply name
  title.characters = paintStyleName;

  // Get spec
  let spec = DocBlockComponentInstance.findOne((node) => {
    return node.id.endsWith(DocBlockSpec);
  }) as TextNode;
  // Apply spec
  spec.characters = paintStyleSpec;

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
  return DocBlockComponentInstance;
}
