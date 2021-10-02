import { addHeaderToFrame, buildStyleFrames, getStoredFrame, storedFrameExists } from "./frameHelpers";
import { buildComponentStyleSwatch, buildStyleFramesNew, getComponentStyleSwatch } from "./new";
import { createColorStyleDocBlockInstance } from "./docBlockInstance";
import { boostrapStyleDocFrame } from "./styleDocFrame";

async function generateLocalPaintStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get styles
  const localPaintStyles = figma.getLocalPaintStyles();

  // SETUP MASTER ARTBOARD
  const paintStylesFrame = boostrapStyleDocFrame("ColorStylesFrame");

  // Add header => move to bootstrap
  addHeaderToFrame("Color Styles", paintStylesFrame);

  // Testing New --------------------------------------------------------------------------------------------
  // buildComponentStyleSwatch();
  getComponentStyleSwatch();
  buildStyleFramesNew<PaintStyle>(localPaintStyles, paintStylesFrame, createColorStyleDocBlockInstance);

  // Get insert position
  // Check if textStyles frame exists to set insert position
  // Either at the beginning or after the text styles
  const insertPosition = storedFrameExists("TextStylesFrame") ? 1 : 0;

  // Add style frame to main frame
  mainFrame.insertChild(insertPosition, paintStylesFrame);
}

export { generateLocalPaintStylesDoc };

// Multi fill
// Additional metadata (gradiant type)
// different color modes
// Better visual
// more info on image fill
