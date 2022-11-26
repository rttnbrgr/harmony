import { buildColorStyleBlock } from "./buildColorStyleBlock";
import { addHeaderToFrame, buildStyleFrames, storedFrameExists } from "./frameHelpers";
import { boostrapStyleDocFrame } from "./styleDocFrame";
import { TEXT_STYLES_FRAME } from "./types";

async function generateLocalPaintStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get paint styles
  const localPaintStyles = figma.getLocalPaintStyles();

  // Setup frame
  const paintStylesMasterFrame = boostrapStyleDocFrame("ColorStylesFrame");

  // Add header
  await addHeaderToFrame("Color Styles", paintStylesMasterFrame);

  // Build the style frames and append them to the master artboard
  await buildStyleFrames<PaintStyle>(localPaintStyles, paintStylesMasterFrame, buildColorStyleBlock, {
    x: 64 + 16,
    y: null,
  });

  // Get insert position
  // Check if textStyles frame exists to set insert position
  // Either at the beginning or after the text styles
  const insertPosition = storedFrameExists(TEXT_STYLES_FRAME) ? 1 : 0;

  // Add style frame to main frame
  mainFrame.insertChild(insertPosition, paintStylesMasterFrame);
}

export default generateLocalPaintStylesDoc;
