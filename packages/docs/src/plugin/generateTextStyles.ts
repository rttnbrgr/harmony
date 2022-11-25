import { buildSample } from "./textStyles";
import { addHeaderToFrame, applyStyleFrameStyles, buildStyleFrames } from "./helpers";

async function generateLocalTextStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get effect styles
  const localTextStyles = figma.getLocalTextStyles();
  console.log("localEffectStyles", localTextStyles);

  // SETUP MASTER ARTBOARD
  const textStylesMasterFrame = applyStyleFrameStyles("TextStylesFrame");
  // Add name; for use in checking for this frames existence
  textStylesMasterFrame.name = "Text Styles";

  // Add header
  await addHeaderToFrame("Text Styles", textStylesMasterFrame);

  // Build the style frames and append them to the master artboard
  await buildStyleFrames<TextStyle>(localTextStyles, textStylesMasterFrame, buildSample);
  //   buildTextStyleFrames(localTextStyles, textStylesMasterFrame);

  // Add style frame to main frame
  // Always the first child
  mainFrame.insertChild(0, textStylesMasterFrame);
}

export default generateLocalTextStylesDoc;
