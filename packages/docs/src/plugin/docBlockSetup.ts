import {
  DOC_BLOCK_ROOT,
  DOC_BLOCK_SWATCH,
  DOC_BLOCK_TITLE,
  DOC_BLOCK_SPEC,
  DOC_BLOCK_2_ROOT,
  DOC_BLOCK_2_TITLE,
  DOC_BLOCK_2_SPEC,
} from "./types";
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

async function setupComponentTextPieces(componentRef, configObject) {
  const { parts } = configObject;

  // Build title
  const TitleText = await addText("Style Title");
  componentRef.setPluginData(parts.title, TitleText.id);

  // Build spec
  const SpecText = await addText("Style Spec");
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

export {
  DocBlockConfig,
  DocBlockSwatchConfig,
  docBlockSwatchConfig,
  docBlockTextConfig,
  setupComponentBegin,
  setupComponentStyles,
  setupTextGroupFrame,
  setupComponentTextPieces,
  setupComponentSwatch,
};
