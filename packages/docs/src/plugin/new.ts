import { getSpecString } from "./getSpec";
import { addText } from "./utils";

export const DOC_BLOCK_ROOT: string = "DocBlockComponent";
export const DOC_BLOCK_SWATCH: string = "DocBlockSwatch";
export const DOC_BLOCK_TITLE: string = "DocBlockTitle";
export const DOC_BLOCK_SPEC: string = "DocBlockSpec";

export const DOC_BLOCK_2_ROOT: string = "DocBlockComponent2";
export const DOC_BLOCK_2_TITLE: string = "DocBlockTitle2";
export const DOC_BLOCK_2_SPEC: string = "DocBlockSpec2";

const spacer = 8;

const DocBlockConfig = {
  x: figma.viewport.center.x,
  y: figma.viewport.center.y,
  layoutMode: "HORIZONTAL" as "NONE" | "HORIZONTAL" | "VERTICAL",
  itemSpacing: spacer,
  counterAxisAlignItems: "CENTER" as "MIN" | "MAX" | "CENTER",
  counterAxisSizingMode: "AUTO" as "FIXED" | "AUTO",
};

const DocBlockSwatchConfig = {
  size: spacer * 8,
  cornerRadius: spacer,
};

export function buildComponentStyleSwatch() {
  console.log("👋 buildComponentStyleSwatch", figma.viewport);
  // figma.viewport.center

  /**
   * Build the component itself
   */

  // Create it
  const sampleComponent: ComponentNode = figma.createComponent();

  // Give it a name
  sampleComponent.name = "Doc Block";

  // Save it
  figma.root.setPluginData(DOC_BLOCK_ROOT, sampleComponent.id);

  /**
   * Build the pieces
   */

  // Build the swatch
  // && put it in the cnter of the page
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.resize(DocBlockSwatchConfig.size, DocBlockSwatchConfig.size);
  colorStyleRect.resize(21, 55);
  colorStyleRect.cornerRadius = DocBlockSwatchConfig.cornerRadius;
  // figma.currentPage.appendChild(colorStyleRect);
  console.log("colorStyleRect", colorStyleRect);

  // Build title
  const TitleText = addText("Style Title");
  console.log("TitleText", TitleText);
  console.log("TitleText ID", TitleText.id);

  // Build spec
  const SpecText = addText("Style Spec");
  // need to add autolayout
  SpecText.y = 14;

  // Save the children refs
  sampleComponent.setPluginData(DOC_BLOCK_SWATCH, colorStyleRect.id);
  sampleComponent.setPluginData(DOC_BLOCK_TITLE, TitleText.id);
  sampleComponent.setPluginData(DOC_BLOCK_SPEC, SpecText.id);

  // Create the text group
  const textGroup = figma.group([TitleText, SpecText], figma.currentPage);

  /**
   * Add the pieces to the component
   */

  // Add component children
  sampleComponent.appendChild(colorStyleRect);
  sampleComponent.appendChild(textGroup);

  // Component Config Opinions
  sampleComponent.x = DocBlockConfig.x;
  sampleComponent.layoutMode = DocBlockConfig.layoutMode;
  sampleComponent.itemSpacing = DocBlockConfig.itemSpacing;
  sampleComponent.counterAxisAlignItems = DocBlockConfig.counterAxisAlignItems;
  sampleComponent.counterAxisSizingMode = DocBlockConfig.counterAxisSizingMode;
  sampleComponent.resizeWithoutConstraints(sampleComponent.width, sampleComponent.height);
}

export function buildComponentStyleText() {
  console.log("👋 buildComponentStyleText");

  /**
   * Build the component itself
   */

  // Create it
  const sampleComponent: ComponentNode = figma.createComponent();

  // Give it a name
  sampleComponent.name = "Doc Block";

  // Save it
  figma.root.setPluginData(DOC_BLOCK_2_ROOT, sampleComponent.id);

  /**
   * Build the pieces
   */

  // Build title
  const TitleText = addText("Style Title");
  console.log("TitleText", TitleText);
  console.log("TitleText ID", TitleText.id);

  // Build spec
  const SpecText = addText("Style Spec");
  // need to add autolayout
  SpecText.y = 14;

  // Save the children refs
  sampleComponent.setPluginData(DOC_BLOCK_2_TITLE, TitleText.id);
  sampleComponent.setPluginData(DOC_BLOCK_2_SPEC, SpecText.id);

  // Create the text group
  const textGroup = figma.group([TitleText, SpecText], figma.currentPage);

  /**
   * Add the pieces to the component
   */

  // Add component children
  sampleComponent.appendChild(textGroup);

  // Component Config Opinions
  sampleComponent.x = DocBlockConfig.x;
  sampleComponent.layoutMode = DocBlockConfig.layoutMode;
  sampleComponent.itemSpacing = DocBlockConfig.itemSpacing;
  sampleComponent.counterAxisAlignItems = DocBlockConfig.counterAxisAlignItems;
  sampleComponent.counterAxisSizingMode = DocBlockConfig.counterAxisSizingMode;
  sampleComponent.resizeWithoutConstraints(sampleComponent.width, sampleComponent.height);
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
   * Also genrate the spec string
   */

  const { name: paintStyleName, id: paintStyleId, paints } = paintStyle;
  let paintStyleSpec = getSpecString(paintStyle);

  // Logs
  console.log("🎨 ", paintStyleName, paintStyleId);
  console.log("spec:", paintStyleSpec);
  console.log("👆 end createColorStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  // At this point, we have our spec, name, and id

  /**
   * Get all the references from the root component instance
   */

  // Get master id
  const DocBlockId = figma.root.getPluginData(DOC_BLOCK_ROOT);
  // Get master node
  const DocBlockComponentMaster = figma.getNodeById(DocBlockId) as ComponentNode;
  console.log("DocBlockComponentMaster", DocBlockComponentMaster);

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

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
export function createTextStyleDocBlockInstance(textStyle: TextStyle) {
  if (!textStyle) {
    console.log("🚨 Not a text style");
    return;
  }
  console.log("👇 createTextStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  /**
   * Destruct the important values from the paintStyle
   * Also genrate the spec string
   */

  const { name: textStyleName, id: textStyleId } = textStyle;
  let textStyleSpec = getSpecString(textStyle);

  // Logs
  console.log("🎨 ", textStyleName, textStyleId);
  console.log("spec:", textStyleSpec);
  console.log("👆 end createColorStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  // At this point, we have our spec, name, and id

  /**
   * Get all the references from the root component instance
   */

  // Get master id
  const DocBlockId = figma.root.getPluginData(DOC_BLOCK_2_ROOT);
  // Get master node
  const DocBlockComponentMaster = figma.getNodeById(DocBlockId) as ComponentNode;
  console.log("DocBlockComponentMaster", DocBlockComponentMaster);

  /**
   * Create and update instance
   */

  // Create instance
  const DocBlockComponentInstance = DocBlockComponentMaster.createInstance();
  DocBlockComponentInstance.y = 50;
  DocBlockComponentInstance.x = 50;

  // Update Instance
  // updateInstanceTitle(DocBlockComponentMaster, DocBlockComponentInstance, textStyleName);
  const DocBlockTitle = DocBlockComponentMaster.getPluginData(DOC_BLOCK_2_TITLE);
  let title = DocBlockComponentInstance.findOne((node) => node.id.endsWith(DocBlockTitle)) as TextNode;
  title.characters = textStyleName;
  title.textStyleId = textStyleId;
  // updateInstanceSpec(DocBlockComponentMaster, DocBlockComponentInstance, textStyleSpec);
  const DocBlockSpec = DocBlockComponentMaster.getPluginData(DOC_BLOCK_2_SPEC);
  let spec = DocBlockComponentInstance.findOne((node) => node.id.endsWith(DocBlockSpec)) as TextNode;
  spec.characters = textStyleSpec;

  return DocBlockComponentInstance;
}

export function buildStyleFramesNew<StyleType>(
  stylesArray: Array<StyleType>,
  frame: FrameNode,
  buildSample: (styleType: StyleType) => InstanceNode
) {
  stylesArray.forEach((styleType, i) => {
    // Build each
    const styleFrameItem = buildSample(styleType);
    // Add to StyleFrame
    frame.appendChild(styleFrameItem);
  });
}
