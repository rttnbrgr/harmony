import {
  MAIN_FRAME_KEY,
  DOC_BLOCK_ROOT,
  DOC_BLOCK_SWATCH,
  DOC_BLOCK_TITLE,
  DOC_BLOCK_SPEC,
  DOC_BLOCK_2_ROOT,
  DOC_BLOCK_2_TITLE,
  DOC_BLOCK_2_SPEC,
} from "./types";
import { getSpecString } from "./getSpec";
import { storedFrameExists, getStoredFrame } from "./frameHelpers";
import { addText, simpleClone } from "./utils";

const spacer = 8;

const DocBlockConfig = {
  // x: figma.viewport.center.x,
  // y: figma.viewport.center.y,
  layoutMode: "HORIZONTAL" as "NONE" | "HORIZONTAL" | "VERTICAL",
  itemSpacing: spacer,
  counterAxisAlignItems: "CENTER" as "MIN" | "MAX" | "CENTER",
  counterAxisSizingMode: "AUTO" as "FIXED" | "AUTO",
};

const DocBlockSwatchConfig = {
  size: spacer * 8,
  cornerRadius: spacer,
};

export function getComponentStyleSwatch() {
  let component;
  // check if it exists
  const componentExists = storedFrameExists(DOC_BLOCK_ROOT);
  // if it exists
  if (componentExists) {
    // console.log("👀👀👀👀 ComponentStyleSwatch already exists");
    component = getStoredFrame(DOC_BLOCK_ROOT);
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
    // console.log("removed? ", isRemoved);
    // the remove function doesnt work, so we need to try cloning and relinking this
    // return component;

    // Lets manually remove and rebuild teh component
    // console.log("let's remove teh component?");
  }
  // boostrap it
  // console.log("🙅‍♀️🙅‍♀️🙅‍♀️ doesnt exist. gotta create it");
  component = buildComponentStyleSwatch();
}

const docBlockSwatchConfig = {
  name: "Doc Block - Swatch",
  parts: {
    root: DOC_BLOCK_ROOT,
    swatch: DOC_BLOCK_SWATCH,
    title: DOC_BLOCK_TITLE,
    spec: DOC_BLOCK_SPEC,
  },
  styles: {
    root: DocBlockConfig,
  },
};

const docBlockTextConfig = {
  name: "Doc Block - Text",
  parts: {
    root: DOC_BLOCK_2_ROOT,
    title: DOC_BLOCK_2_TITLE,
    spec: DOC_BLOCK_2_SPEC,
  },
  styles: {
    root: DocBlockConfig,
  },
};

function setupComponentBegin(configObject) {
  const { name, parts } = configObject;

  // Create it
  const masterComponent: ComponentNode = figma.createComponent();

  // Give it a name
  masterComponent.name = name;

  // Save it
  figma.root.setPluginData(parts.root, masterComponent.id);

  // Setup component styles
  setupComponentStyles(masterComponent, configObject.styles.root);

  // Return the component
  return masterComponent;
}

function setupComponentStyles(componentRef, configStyleObject) {
  Object.keys(configStyleObject).forEach((property) => {
    componentRef[property] = configStyleObject[property];
  });
}

function setupTextGroupFrame() {
  const textGroupFrame = figma.createFrame();
  /* S T Y L E S */
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

function setupComponentTextPieces(componentRef, configObject) {
  const { parts } = configObject;

  // Build title
  const TitleText = addText("Style Title");
  componentRef.setPluginData(parts.title, TitleText.id);

  // Build spec
  const SpecText = addText("Style Spec");
  componentRef.setPluginData(parts.spec, SpecText.id);

  // Create the text frame group
  const textGroup = setupTextGroupFrame();

  // Add textGroup children
  textGroup.appendChild(TitleText);
  textGroup.appendChild(SpecText);

  // Add component children
  componentRef.appendChild(textGroup);
}

function setupComponentSwatch(componentRef, configObject) {
  const { parts } = configObject;

  // Build the swatch
  const SwatchRect = figma.createRectangle();

  /* S T Y L E S */
  const swatchStyleConfig = DocBlockSwatchConfig; // hardcoded
  const { size: swatchSize, cornerRadius: swatchCornerRadius } = swatchStyleConfig;
  SwatchRect.resize(swatchSize, swatchSize);
  SwatchRect.cornerRadius = swatchCornerRadius;

  // Set ref
  componentRef.setPluginData(parts.swatch, SwatchRect.id);

  // Add component children
  componentRef.appendChild(SwatchRect);
}

function spoofComponentPlacement(componentRef, isSwatch = true) {
  // resize
  componentRef.resizeWithoutConstraints(componentRef.width, componentRef.height);
  // Temp fix: Get the edge of the master frame
  const mainFrame = getStoredFrame(MAIN_FRAME_KEY) as FrameNode;
  componentRef.x = isSwatch ? mainFrame.x : mainFrame.x + 200;
  componentRef.y = mainFrame.y - 200 - componentRef.height;
}

export function buildComponentStyleSwatch() {
  // console.log("😎 buildComponentStyleSwatch");

  // Build the component itself
  const sampleComponent: ComponentNode = setupComponentBegin(docBlockSwatchConfig);

  // Build the swatch
  setupComponentSwatch(sampleComponent, docBlockSwatchConfig);

  // Build the text parts
  setupComponentTextPieces(sampleComponent, docBlockSwatchConfig);

  // Hack: placement
  spoofComponentPlacement(sampleComponent);
}

export function buildComponentStyleText() {
  // console.log("👋 buildComponentStyleText");

  // Build the component itself
  const sampleComponent: ComponentNode = setupComponentBegin(docBlockTextConfig);

  // Build the text parts
  setupComponentTextPieces(sampleComponent, docBlockTextConfig);

  // Hack: placement
  spoofComponentPlacement(sampleComponent, false);
}

/**
 *
 * @param stylesArray Array of styles
 * @param frame Frame to append to
 * @param buildSample function to use to build style docs
 */
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
