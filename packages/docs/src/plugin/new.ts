import { getSpecString } from "./getSpec";
import { MAIN_FRAME_KEY } from "./helpers";
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
  // // check if it exists
  // const componentExists = storedFrameExists(DOC_BLOCK_ROOT);
  // if (componentExists) {
  //   console.log("👀👀👀👀 already exists");
  //   // return;
  // }

  // if not, bootstrap it
  // console.log("👋 buildComponentStyleSwatch", figma.viewport);
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
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.resize(DocBlockSwatchConfig.size, DocBlockSwatchConfig.size);
  colorStyleRect.resize(21, 55);
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

  /**
   * Add the pieces to the component
   */

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
