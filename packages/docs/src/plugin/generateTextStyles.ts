import { buildTextStyleBlock } from "./buildTextStyleBlock";
import { buildStyleFrames } from "./buildStyleFrames";
import { addHeaderToFrame } from "./frameHelpers";
import { boostrapStyleDocFrame } from "./styleDocFrame";

async function generateLocalTextStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get styles
  const localTextStyles = figma.getLocalTextStyles();

  // Setup frame
  const textStylesMasterFrame = boostrapStyleDocFrame("TextStylesFrame");

  // Add header
  await addHeaderToFrame("Text Styles", textStylesMasterFrame);

  // Build the style frames and append them to the master artboard
  await buildStyleFrames<TextStyle>(localTextStyles, textStylesMasterFrame, buildTextStyleBlock);

  // Add style frame to main frame
  // Always the first child
  mainFrame.insertChild(0, textStylesMasterFrame);
}

export default generateLocalTextStylesDoc;
