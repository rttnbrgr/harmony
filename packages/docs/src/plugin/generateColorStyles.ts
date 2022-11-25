import { buildSample } from "./colorStyles";
import { addHeaderToFrame, applyStyleFrameStyles, buildStyleFrames } from "./helpers";

async function generateLocalPaintStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get paint styles
  const localPaintStyles = figma.getLocalPaintStyles();

  // SETUP MASTER ARTBOARD
  const paintStylesMasterFrame = applyStyleFrameStyles("ColorStylesFrame");

  // Add header
  await addHeaderToFrame("Color Styles", paintStylesMasterFrame);

  // Build the style frames and append them to the master artboard
  await buildStyleFrames<PaintStyle>(localPaintStyles, paintStylesMasterFrame, buildSample, { x: 64 + 16, y: null });

  // Check if textStyles frame exists
  // This feels brittle
  const textStylesFrameExists = mainFrame.findChildren((x) => {
    console.log("child", x);
    console.log("child name", x.name);
    return x.name === "Text Styles";
  }).length;
  console.log("textStylesFrameExists", textStylesFrameExists);

  // Based on this, set insert position
  const insertPosition = textStylesFrameExists ? 1 : 0;
  console.log("insertPosition", insertPosition);

  // Add style frame to main frame
  // Either at the beginning or after the text styles
  mainFrame.insertChild(insertPosition, paintStylesMasterFrame);
}

export default generateLocalPaintStylesDoc;
