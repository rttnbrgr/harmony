import { addHeaderToFrame } from "./frameHelpers";
import { boostrapStyleDocFrame } from "./styleDocFrame";
import { buildStyleFramesNew } from "./new";
import { createEffectStyleDocBlockInstance } from "./docBlockInstance";

async function generateLocalEffectStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get styles
  const localEffectStyles = figma.getLocalEffectStyles();

  // SETUP MASTER ARTBOARD
  const effectStylesMasterFrame = boostrapStyleDocFrame("EffectStylesFrame");

  // Add header
  addHeaderToFrame("Effect Styles", effectStylesMasterFrame);

  // Testing New --------------------------------------------------------------------------------------------
  // this boostraps the component swatch. this needs work
  // getComponentStyleSwatch();
  // this builds the style frame
  buildStyleFramesNew<EffectStyle>(localEffectStyles, effectStylesMasterFrame, createEffectStyleDocBlockInstance);

  // Add style frame to main frame
  mainFrame.appendChild(effectStylesMasterFrame);
}

export default generateLocalEffectStylesDoc;
