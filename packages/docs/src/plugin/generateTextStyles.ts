import { addHeaderToFrame } from "./frameHelpers";
import { buildComponentStyleText, buildStyleFramesNew } from "./new";
import { createTextStyleDocBlockInstance } from "./docBlockInstance";
import { boostrapStyleDocFrame } from "./styleDocFrame";

async function generateLocalTextStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get styles
  const localTextStyles = figma.getLocalTextStyles();

  // Setup styles frame
  const textStylesFrame = boostrapStyleDocFrame("TextStylesFrame");

  // Add header
  addHeaderToFrame("Text Styles", textStylesFrame);

  // Testing New ----------------
  // Build/source the component
  buildComponentStyleText();

  // Build the style frames and append them to the master artboard
  buildStyleFramesNew<TextStyle>(localTextStyles, textStylesFrame, createTextStyleDocBlockInstance);

  // Add style frame to main frame
  mainFrame.insertChild(0, textStylesFrame);
}

export default generateLocalTextStylesDoc;
