import {
  getOpacityStringFromSolidPaint,
  getColorStringFromSolidPaint,
  getSpecStringFromSolidPaint,
  getSpecStringFromGradiantPaint,
} from "./colorStyles";

function addTextNew(string: string = "Your new text"): TextNode {
  const newText = figma.createText();
  newText.characters = string;
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
  const TitleText = addTextNew("Style Title");
  console.log("TitleText", TitleText);
  console.log("TitleText ID", TitleText.id);

  // Build spec
  const SpecText = addTextNew("Style Spec");
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

function updateInstanceSwatch(masterComponent: ComponentNode, instanceComponent: InstanceNode, styleId: string) {
  // Lookup the ID
  const DocBlockSwatch = masterComponent.getPluginData(DOC_BLOCK_SWATCH);

  // Find swatch on the instance
  let swatch = instanceComponent.findChild((node) => node.id.endsWith(DocBlockSwatch)) as RectangleNode;

  // Apply swatch
  swatch.fillStyleId = styleId;
}

function updateInstanceTitle(masterComponent: ComponentNode, instanceComponent: InstanceNode, styleName: string) {
  // Lookup the ID
  const DocBlockTitle = masterComponent.getPluginData(DOC_BLOCK_TITLE);

  // Find title on the instance
  let title = instanceComponent.findOne((node) => node.id.endsWith(DocBlockTitle)) as TextNode;

  // Apply name
  title.characters = styleName;
}

function updateInstanceSpec(masterComponent: ComponentNode, instanceComponent: InstanceNode, styleSpec: string) {
  // Lookup the ID
  const DocBlockSpec = masterComponent.getPluginData(DOC_BLOCK_SPEC);

  // Find spec on the instance
  let spec = instanceComponent.findOne((node) => node.id.endsWith(DocBlockSpec)) as TextNode;

  // Apply spec
  spec.characters = styleSpec;
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

  // Update Instance
  updateInstanceSwatch(DocBlockComponentMaster, DocBlockComponentInstance, paintStyleId);
  updateInstanceTitle(DocBlockComponentMaster, DocBlockComponentInstance, paintStyleName);
  updateInstanceSpec(DocBlockComponentMaster, DocBlockComponentInstance, paintStyleSpec);

  return DocBlockComponentInstance;
}

export function buildStyleFramesNew<StyleType>(
  stylesArray: Array<StyleType>,
  frame: FrameNode,
  // buildSample: (styleType: StyleType) => FrameNode,
  buildSample: (styleType: StyleType) => InstanceNode
) {
  console.log("buildStyleFramesNew");
  stylesArray.forEach((styleType, i) => {
    // Build each
    const styleFrameItem = buildSample(styleType);
    // Add to StyleFrame
    frame.appendChild(styleFrameItem);
  });
}
