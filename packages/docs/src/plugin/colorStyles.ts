import { addHeaderToFrame, applyStyleFrameStyles, buildStyleFrames, getStoredFrame } from "./helpers";
import { buildComponentStyleSwatch, buildStyleFramesNew, createColorStyleDocBlockInstance } from "./new";

type textOptions = {
  x: number;
  y: number;
};

function addText(string: string = "Your new text", options: textOptions): TextNode {
  const newText = figma.createText();
  newText.characters = string;
  if (options.x) {
    newText.x = options.x;
  }
  if (options.y) {
    newText.y = options.y;
  }
  figma.currentPage.appendChild(newText);
  return newText;
}

function getColorStylesFrameInsertPosition(mainFrame: FrameNode) {
  // Check if textStyles frame exists
  // This feels brittle
  // Should probably save a value on the frame and lookup that up
  const textStylesFrameExists = mainFrame.findChildren((x) => {
    // console.log("child", x);
    // console.log("child name", x.name);
    return x.name === "Text Styles";
  }).length;

  // Based on this, set insert position
  // Either at the beginning or after the text styles
  const insertPosition = textStylesFrameExists ? 1 : 0;
  // console.log("insertPosition", insertPosition);
  return insertPosition;
}

async function generateLocalPaintStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get paint styles
  const localPaintStyles = figma.getLocalPaintStyles();
  // console.log("localPaintStyles", localPaintStyles);

  // SETUP MASTER ARTBOARD
  const paintStylesMasterFrame = applyStyleFrameStyles("ColorStylesFrame");

  // Add header
  addHeaderToFrame("Color Styles", paintStylesMasterFrame);

  // Build the style frames and append them to the master artboard
  // buildStyleFrames<PaintStyle>(localPaintStyles, paintStylesMasterFrame, buildSample, { x: 64 + 16, y: null });

  // Testing New --------------------------------------------------------------------------------------------
  buildComponentStyleSwatch();
  createColorStyleDocBlockInstance(localPaintStyles[2]);
  buildStyleFramesNew<PaintStyle>(localPaintStyles, paintStylesMasterFrame, createColorStyleDocBlockInstance);

  // Get insert position
  const insertPosition = getColorStylesFrameInsertPosition(mainFrame);

  // Add style frame to main frame
  mainFrame.insertChild(insertPosition, paintStylesMasterFrame);
}

export { generateLocalPaintStylesDoc, addText };

// Multi fill
// opacity on solid paint fill
// Additional metadata (gradiant type)
// different color modes
// Better visual
// more info on image fill
