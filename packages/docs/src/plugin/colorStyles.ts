import { addHeaderToFrame, boostrapStyleDocFrame, buildStyleFrames, getStoredFrame } from "./helpers";
import { buildComponentStyleSwatch, buildStyleFramesNew, createColorStyleDocBlockInstance } from "./new";

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

  // SETUP MASTER ARTBOARD
  const paintStylesFrame = boostrapStyleDocFrame("ColorStylesFrame");

  // Add header => move to bootstrap
  addHeaderToFrame("Color Styles", paintStylesFrame);

  // Build the style frames and append them to the master artboard
  // buildStyleFrames<PaintStyle>(localPaintStyles, paintStylesMasterFrame, buildSample, { x: 64 + 16, y: null });

  // Testing New --------------------------------------------------------------------------------------------
  buildComponentStyleSwatch();
  buildStyleFramesNew<PaintStyle>(localPaintStyles, paintStylesFrame, createColorStyleDocBlockInstance);

  // Get insert position
  const insertPosition = getColorStylesFrameInsertPosition(mainFrame);

  // Add style frame to main frame
  mainFrame.insertChild(insertPosition, paintStylesFrame);
}

export { generateLocalPaintStylesDoc };

// Multi fill
// Additional metadata (gradiant type)
// different color modes
// Better visual
// more info on image fill

//
// build componetStyleText
// move this stuff over to the text styles
// refactor 'addHeaderToFrame' into bootstrap func
// update how we check for existence of textStylesframe
