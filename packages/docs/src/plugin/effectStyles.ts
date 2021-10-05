import { addText } from "./utils";
import { addHeaderToFrame, buildStyleFrames, getStoredFrame } from "./frameHelpers";
import { boostrapStyleDocFrame } from "./styleDocFrame";
import { getSpecStringFromEffectStyle } from "./getSpec";

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
function buildSample(effectStyle: EffectStyle) {
  if (!effectStyle) {
    return;
  }

  const effectStyleName = effectStyle.name;
  const effectStyleId = effectStyle.id;
  let effectStyleSpec = getSpecStringFromEffectStyle(effectStyle);

  console.log("🎨 ", effectStyleName, effectStyle);

  // put it here
  const sampleX = 400;
  const sampleY = 0;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  const whiteFill: Array<SolidPaint> = [
    {
      type: "SOLID",
      color: {
        r: 1,
        g: 1,
        b: 1,
      },
    },
  ];

  // build the rect
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.x = sampleX;
  colorStyleRect.y = sampleY;
  colorStyleRect.fills = whiteFill;
  colorStyleRect.effectStyleId = effectStyleId;
  colorStyleRect.resize(rectSize, rectSize);
  colorStyleRect.cornerRadius = spacer;
  figma.currentPage.appendChild(colorStyleRect);

  // Build title
  const colorStyleTitleText = addText(effectStyleName);
  colorStyleTitleText.x = textX;
  colorStyleTitleText.y = sampleY;

  // Build spec
  const colorStyleSpecText = addText(effectStyleSpec);
  colorStyleSpecText.x = textX;
  colorStyleSpecText.y = sampleY + 14;

  // Group text nodes
  const textGroup = figma.group([colorStyleTitleText, colorStyleSpecText], figma.currentPage);

  // Create the frame, append text + rect, position it
  const sampleFrame = figma.createFrame();
  sampleFrame.appendChild(colorStyleRect);
  sampleFrame.appendChild(textGroup);
  sampleFrame.layoutMode = "HORIZONTAL";
  sampleFrame.itemSpacing = 8;
  sampleFrame.counterAxisAlignItems = "CENTER";
  sampleFrame.x = sampleX;
  let getSampleFrameWidth = () => sampleFrame.width;
  let sampleFrameWidth = getSampleFrameWidth();

  sampleFrame.resizeWithoutConstraints(sampleFrameWidth, rectSize);
  // console.log("sampleFrame", sampleFrame);

  return sampleFrame;
}

async function generateLocalEffectStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // Get styles
  const localEffectStyles = figma.getLocalEffectStyles();

  // SETUP MASTER ARTBOARD
  const effectStylesMasterFrame = boostrapStyleDocFrame("EffectStylesFrame");

  // Add header
  addHeaderToFrame("Effect Styles", effectStylesMasterFrame);

  // Build the style frames and append them to the master artboard
  buildStyleFrames<EffectStyle>(localEffectStyles, effectStylesMasterFrame, buildSample, { x: 64 + 16, y: null });

  // Add style frame to main frame
  mainFrame.appendChild(effectStylesMasterFrame);
}

export { generateLocalEffectStylesDoc };
