import { addHeaderToFrame, storedFrameExists } from "./frameHelpers";
import { buildStyleFramesNew, getComponentStyleSwatch } from "./new";
import { createColorStyleDocBlockInstance } from "./docBlockInstance";
import { boostrapStyleDocFrame } from "./styleDocFrame";

async function generateLocalPaintStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get styles
  const localPaintStyles = figma.getLocalPaintStyles();

  // Setup styles frame
  const paintStylesFrame = boostrapStyleDocFrame("ColorStylesFrame");

  // Add header => move to bootstrap
  addHeaderToFrame("Color Styles", paintStylesFrame);

  // Testing New --------------------------------------------------------------------------------------------
  // this boostraps the component swatch. this needs work
  getComponentStyleSwatch();
  // this builds the style frame
  buildStyleFramesNew<PaintStyle>(localPaintStyles, paintStylesFrame, createColorStyleDocBlockInstance);

  // Get insert position
  // Check if textStyles frame exists to set insert position
  // Either at the beginning or after the text styles
  const insertPosition = storedFrameExists("TextStylesFrame") ? 1 : 0;

  // Add style frame to main frame
  mainFrame.insertChild(insertPosition, paintStylesFrame);
}

export default generateLocalPaintStylesDoc;
