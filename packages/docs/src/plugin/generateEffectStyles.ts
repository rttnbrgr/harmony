import { buildEffectStyleBlock } from "./buildEffectStyleBlock";
import { addHeaderToFrame, applyStyleFrameStyles, buildStyleFrames } from "./helpers";

async function generateLocalEffectStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get effect styles
  const localEffectStyles = figma.getLocalEffectStyles();
  console.log("localEffectStyles", localEffectStyles);

  // SETUP MASTER ARTBOARD
  const effectStylesMasterFrame = applyStyleFrameStyles("EffectStylesFrame");

  // Add header
  await addHeaderToFrame("Effect Styles", effectStylesMasterFrame);

  console.log("before buildEffectStyleFrames");

  // Build the style frames and append them to the master artboard
  await buildStyleFrames<EffectStyle>(localEffectStyles, effectStylesMasterFrame, buildEffectStyleBlock, {
    x: 64 + 16,
    y: null,
  });

  // Add style frame to main frame
  mainFrame.appendChild(effectStylesMasterFrame);
}

export default generateLocalEffectStylesDoc;
