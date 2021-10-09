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
  FigmaDocsFrame,
  DocBlockNodes,
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
 * for effect
 */

const defaultFills: Array<SolidPaint> = [
  {
    type: "SOLID",
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
  },
];

// duplicates another helper
export function getStoredNode(frameName: FigmaDocsFrame | DocBlockNodes) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);

  return frame;
}

// function updateInstanceSwatch(masterComponent: ComponentNode, instanceComponent: InstanceNode, styleId: string) {}
function getInstanceNode(
  masterComponent: ComponentNode,
  instanceComponent: InstanceNode,
  searchId: FigmaDocsFrame | DocBlockNodes,
  deepFind: boolean = true
) {
  // Lookup the ID
  const pluginDataId = masterComponent.getPluginData(searchId);
  // Find the node on the instance
  let node;
  if (deepFind) {
    node = instanceComponent.findOne((node) => node.id.endsWith(pluginDataId));
  } else {
    node = instanceComponent.findChild((node) => node.id.endsWith(pluginDataId));
  }

  //
  console.log("pluginDataId", pluginDataId);
  console.log("node", node);

  return node;
}

/**
 * setup a new build sample func
 */

// Takes a paint style and returns a frame documenting that style
export function createColorStyleDocBlockInstance(paintStyle: PaintStyle) {
  // Destruct + generate the spec string
  const { name: paintStyleName, id: paintStyleId, paints } = paintStyle;
  let paintStyleSpec = getSpecString(paintStyle);

  // Get master node
  const DocBlockComponentMaster = getStoredNode(DOC_BLOCK_ROOT) as ComponentNode;

  // Create instance
  const DocBlockComponentInstance = DocBlockComponentMaster.createInstance();
  DocBlockComponentInstance.y = 200;

  // Update the swatch
  let swatch = getInstanceNode(DocBlockComponentMaster, DocBlockComponentInstance, DOC_BLOCK_SWATCH) as RectangleNode;
  swatch.fillStyleId = paintStyleId;

  // Update Title
  let title = getInstanceNode(DocBlockComponentMaster, DocBlockComponentInstance, DOC_BLOCK_TITLE) as TextNode;
  title.characters = paintStyleName;

  // Update spec
  let spec = getInstanceNode(DocBlockComponentMaster, DocBlockComponentInstance, DOC_BLOCK_SPEC) as TextNode;
  spec.characters = paintStyleSpec;

  return DocBlockComponentInstance;
}

export function createTextStyleDocBlockInstance(textStyle: TextStyle) {
  // Destruct + generate the spec string
  const { name: textStyleName, id: textStyleId } = textStyle;
  let textStyleSpec = getSpecString(textStyle);

  // Get master component node
  const DocBlockComponentMaster = getStoredNode(DOC_BLOCK_2_ROOT) as ComponentNode;

  if (!DocBlockComponentMaster) {
    console.log("there is no doc block component master");
  }

  // Create instance
  const DocBlockComponentInstance = DocBlockComponentMaster.createInstance();
  DocBlockComponentInstance.y = 50;
  DocBlockComponentInstance.x = 50;

  /* Update Title */
  let title = getInstanceNode(DocBlockComponentMaster, DocBlockComponentInstance, DOC_BLOCK_2_TITLE) as TextNode;
  title.characters = textStyleName;
  title.textStyleId = textStyleId;

  /* Update Spec */
  let spec = getInstanceNode(DocBlockComponentMaster, DocBlockComponentInstance, DOC_BLOCK_2_SPEC) as TextNode;
  spec.characters = textStyleSpec;

  return DocBlockComponentInstance;
}

export function createEffectStyleDocBlockInstance(effectStyle: EffectStyle) {
  if (!effectStyle) {
    console.log("🚨 Not an effect style");
    return;
  }

  /**
   * Destruct the important values from the paintStyle
   * Also genrate the spec string
   */

  const { name: effectStyleName, id: effectStyleId, effects } = effectStyle;
  let effectStyleSpec = getSpecString(effectStyle);

  // Logs
  // console.log("👇 createEffectStyleDocBlockInstance ~~~~~~~~~~~~~~~~~~");
  // console.log("🎨 ", effectStyleName, effectStyleId, effectStyleSpec);

  /**
   * Get the master component
   */

  const DocBlockComponentMaster = getStoredNode(DOC_BLOCK_ROOT) as ComponentNode;

  if (!DocBlockComponentMaster) {
    // if theres isnt a master component, do we build one?
    console.log("there is no doc block component master");
  }

  /**
   * Create and update instance
   */

  // Create instance
  const DocBlockComponentInstance = DocBlockComponentMaster.createInstance();
  DocBlockComponentInstance.y = 200;

  // Update the swatch
  let swatch = getInstanceNode(
    DocBlockComponentMaster,
    DocBlockComponentInstance,
    DOC_BLOCK_SWATCH,
    false
  ) as RectangleNode;
  // need to set to white; then set effect style
  swatch.fills = defaultFills;
  swatch.effectStyleId = effectStyleId;

  // Update Title
  let title = getInstanceNode(DocBlockComponentMaster, DocBlockComponentInstance, DOC_BLOCK_TITLE) as TextNode;
  title.characters = effectStyleName;

  // Update spec
  let spec = getInstanceNode(DocBlockComponentMaster, DocBlockComponentInstance, DOC_BLOCK_SPEC) as TextNode;
  spec.characters = effectStyleSpec;

  return DocBlockComponentInstance;
}
