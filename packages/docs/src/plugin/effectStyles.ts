import { deriveRgbValue, isInt, addText } from "./utils";
import { addHeaderToFrame, buildStyleFrames, getStoredFrame } from "./frameHelpers";
import { boostrapStyleDocFrame } from "./styleDocFrame";
import { getSpecString } from "./getSpec";

function getSpecStringFromRgba(color: RGBA) {
  let rgbaString = "";
  const r = deriveRgbValue(color.r);
  const g = deriveRgbValue(color.g);
  const b = deriveRgbValue(color.b);
  const a = isInt(color.a) ? color.a : color.a.toFixed(2);
  rgbaString = `[${r}, ${g}, ${b}, ${a}]`;
  return rgbaString;
}

// https://stackoverflow.com/questions/11810569/how-to-replace-underscores-with-spaces
function convertUnderscoresToSpace(str) {
  return str.replace(/_/g, " ");
}

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

type ShadowEffectType = "DROP_SHADOW" | "INNER_SHADOW";
type BlurEffectType = "LAYER_BLUR" | "BACKGROUND_BLUR";
type EffectType = ShadowEffectType | BlurEffectType;

function getEffectTypeSpecStringFromEffect(effect: Effect) {
  let effectType = effect.type;
  let specString = effectType;
  specString = convertUnderscoresToSpace(specString);
  specString = toTitleCase(specString);
  return specString;
}

function getOffsetSpecStringFromEffect(effect: ShadowEffect) {
  let effectOffsetX = effect.offset.x;
  let effectOffsetY = effect.offset.y;
  let specString = `Offset: ${effectOffsetX}, ${effectOffsetY}`;
  return specString;
}

function getSpreadSpecStringFromEffect(effect: ShadowEffect) {
  let spread = effect.spread;
  let specString = `Spread: ${spread}`;
  return specString;
}

function getBlurSpecStringFromEffect(effect: Effect) {
  let radius = effect.radius;
  let specString = `Blur: ${radius}`;
  return specString;
}

function getShadowSpecStringFromEffect(effect: ShadowEffect) {
  // Values
  let effectColor = getSpecStringFromRgba(effect.color);
  let effectOffset = getOffsetSpecStringFromEffect(effect);
  let effectSpread = getSpreadSpecStringFromEffect(effect);
  // Reducer
  let specSeperator = " | ";
  let specReducer = (ac, cv) => ac.concat(specSeperator, cv);
  let specString = [effectColor, effectOffset, effectSpread].reduce(specReducer).concat(specSeperator);
  return specString;
}

function getSpecStringFromEffectStyle(effectStyle: EffectStyle) {
  // Logic to build spec string
  let effectStyleSpec = "";

  let isSingle = effectStyle.effects.length === 1;

  // ignore multi-effect for now
  if (!isSingle) {
    effectStyleSpec = "Multiple Fills";
    return effectStyleSpec;
  }

  let firstEffect = effectStyle.effects[0];
  let firstEffectIsShadow = firstEffect.type === "DROP_SHADOW" || firstEffect.type === "INNER_SHADOW";

  // Effect type
  let effectTypeSpec = getEffectTypeSpecStringFromEffect(firstEffect);

  // Shadow or Blur?
  let shadowEffectSpec = "";
  if ("color" in firstEffect && firstEffectIsShadow) {
    shadowEffectSpec = getShadowSpecStringFromEffect(firstEffect);
  }

  // Blur Radius
  let effectRadius = getBlurSpecStringFromEffect(firstEffect);

  effectStyleSpec = `${effectTypeSpec}: ${shadowEffectSpec}${effectRadius}`;

  return effectStyleSpec;
}

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
