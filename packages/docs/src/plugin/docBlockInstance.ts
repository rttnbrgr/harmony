import { getSpecString } from "./getSpec";
import { addText } from "./utils";
import {
  DOC_BLOCK_ROOT,
  DOC_BLOCK_SWATCH,
  DOC_BLOCK_TITLE,
  DOC_BLOCK_SPEC,
  DOC_BLOCK_2_ROOT,
  DOC_BLOCK_2_TITLE,
  DOC_BLOCK_2_SPEC,
} from "./types";

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
  // console.log("👇 createColorStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  /**
   * Destruct the important values from the paintStyle
   * Also genrate the spec string
   */

  const { name: paintStyleName, id: paintStyleId, paints } = paintStyle;
  let paintStyleSpec = getSpecString(paintStyle);

  // Logs
  // console.log("🎨 ", paintStyleName, paintStyleId);
  // console.log("spec:", paintStyleSpec);
  // console.log("👆 end createColorStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  // At this point, we have our spec, name, and id

  /**
   * Get all the references from the root component instance
   */

  // Get master id
  const DocBlockId = figma.root.getPluginData(DOC_BLOCK_ROOT);
  // Get master node
  const DocBlockComponentMaster = figma.getNodeById(DocBlockId) as ComponentNode;
  // console.log("DocBlockComponentMaster", DocBlockComponentMaster);

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
  // console.log("👇 createTextStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  /**
   * Destruct the important values from the paintStyle
   * Also genrate the spec string
   */

  const { name: textStyleName, id: textStyleId } = textStyle;
  let textStyleSpec = getSpecString(textStyle);

  // Logs
  // console.log("🎨 ", textStyleName, textStyleId);
  // console.log("spec:", textStyleSpec);
  // console.log("👆 end createColorStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");

  // At this point, we have our spec, name, and id

  /**
   * Get all the references from the root component instance
   */

  // Get master id
  const DocBlockId = figma.root.getPluginData(DOC_BLOCK_2_ROOT);
  // Get master node
  const DocBlockComponentMaster = figma.getNodeById(DocBlockId) as ComponentNode;
  // console.log("DocBlockComponentMaster", DocBlockComponentMaster);

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
