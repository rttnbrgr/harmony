import { getSpecString } from "./getSpec";
import { storedFrameExists, MAIN_FRAME_KEY } from "./helpers";
import { addText, simpleClone } from "./utils";

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

export function storedNodeExists(nodeName: string) {
  const frameId = figma.root.getPluginData(nodeName);
  console.log("frameId", frameId);
  console.log("!!frameId", !!frameId);
  const frame = figma.getNodeById(frameId);
  console.log("frame", frame);
  console.log("!!frame", !!frame);
  return !!frameId && !!frame;
}

export function getStoredNode(nodeName: string) {
  const frameId = figma.root.getPluginData(nodeName);
  const frame = figma.getNodeById(frameId);
  return frame;
}

export function getComponentStyleSwatch() {
  let component;
  // check if it exists
  const componentExists = storedNodeExists(DOC_BLOCK_ROOT);
  // if it exists
  if (componentExists) {
    console.log("👀👀👀👀 ComponentStyleSwatch already exists");
    component = getStoredNode(DOC_BLOCK_ROOT);
    /**
     * Bug:
     * If comopnent exists but its been removed,
     * the value of removed does not return correclty.
     * This means, once the initial component is created, it will always exist and if its
     * been deleted, we can't revive it.
     *
     * To work around this we will?:
     * - Clone the existing component
     * - Update saved ids
     * - Relink components
     * - Delete old component
     *
     */
    let isRemoved = component.removed;
    console.log("removed? ", isRemoved);
    // the remove function doesnt work, so we need to try cloning and relinking this
    // return component;

    // Lets manually remove and rebuild teh component
    console.log("let's remove teh component?");
  }
  // boostrap it
  // console.log("🙅‍♀️🙅‍♀️🙅‍♀️ doesnt exist. gotta create it");
  component = buildComponentStyleSwatch();
}

function setupTextGroupFrame() {
  const textGroupFrame = figma.createFrame();
  // Setup autolayout
  textGroupFrame.layoutMode = "VERTICAL";
  textGroupFrame.counterAxisSizingMode = "AUTO";
  textGroupFrame.itemSpacing = 0;
  // Remove default bg
  const newFills = simpleClone(textGroupFrame.fills);
  newFills[0].visible = false;
  textGroupFrame.fills = newFills;
  // Return
  return textGroupFrame;
}

export function buildComponentStyleSwatch() {
  console.log("😎 buildComponentStyleSwatch");

  /** Build the component itself */

  // Create it
  const sampleComponent: ComponentNode = figma.createComponent();

  // Give it a name
  sampleComponent.name = "Doc Block";

  // Save it
  figma.root.setPluginData(DOC_BLOCK_ROOT, sampleComponent.id);

  /** Build the pieces */

  // Build the swatch
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.resize(DocBlockSwatchConfig.size, DocBlockSwatchConfig.size);
  colorStyleRect.cornerRadius = DocBlockSwatchConfig.cornerRadius;
  sampleComponent.setPluginData(DOC_BLOCK_SWATCH, colorStyleRect.id);

  // Build title
  const TitleText = addText("Style Title");
  sampleComponent.setPluginData(DOC_BLOCK_TITLE, TitleText.id);

  // Build spec
  const SpecText = addText("Style Spec");
  sampleComponent.setPluginData(DOC_BLOCK_SPEC, SpecText.id);

  // Create the text frame group
  const textGroup = setupTextGroupFrame();

  // Add children
  textGroup.appendChild(TitleText);
  textGroup.appendChild(SpecText);

  /** Add the pieces to the component */

  // Add component children
  sampleComponent.appendChild(colorStyleRect);
  sampleComponent.appendChild(textGroup);

  // Component Config Opinions
  sampleComponent.layoutMode = DocBlockConfig.layoutMode;
  sampleComponent.itemSpacing = DocBlockConfig.itemSpacing;
  sampleComponent.counterAxisAlignItems = DocBlockConfig.counterAxisAlignItems;
  sampleComponent.counterAxisSizingMode = DocBlockConfig.counterAxisSizingMode;
  sampleComponent.resizeWithoutConstraints(sampleComponent.width, sampleComponent.height);

  // Temp fix: Get the edge of the master frame
  const mainFrame = getStoredNode(MAIN_FRAME_KEY) as FrameNode;
  console.log("mainFrame", mainFrame, mainFrame.x, mainFrame.y);
  sampleComponent.x = mainFrame.x;
  sampleComponent.y = mainFrame.y - 100 - sampleComponent.height;
}

export function buildComponentStyleText() {
  console.log("👋 buildComponentStyleText");

  /** Build the component itself */

  // Create it
  const sampleComponent: ComponentNode = figma.createComponent();

  // Give it a name
  sampleComponent.name = "Doc Block";

  // Save it
  figma.root.setPluginData(DOC_BLOCK_2_ROOT, sampleComponent.id);

  /** Build the pieces */

  // Build title
  const TitleText = addText("Style Title");
  sampleComponent.setPluginData(DOC_BLOCK_2_TITLE, TitleText.id);

  // Build spec
  const SpecText = addText("Style Spec");
  // need to add autolayout
  SpecText.y = 14;
  sampleComponent.setPluginData(DOC_BLOCK_2_SPEC, SpecText.id);

  // Create the text frame group
  const textGroup = setupTextGroupFrame();
  // Add children
  textGroup.appendChild(TitleText);
  textGroup.appendChild(SpecText);

  // Create the text group
  // const textGroup = figma.group([TitleText, SpecText], figma.currentPage);

  /** Add the pieces to the component */

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

/**
 * ToDos
 *
 *
 * SomePoint:
 * -----------
 * refactor 'addHeaderToFrame' into bootstrap func
 * update how we check for existence of textStylesframe
 *
 * Component
 * -----------
 * fix text group => frame autolayout
 *
 * Paint/Text/Effect
 * -----------
 * add effect version
 * clean textStyles duplication/unneeded
 * clean effectStyles duplication/unneeded
 *
 *
 */
