import { addText, deriveRgbValue, isInt } from "./colorStyles";
import { getStoredFrame } from "./helpers";

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

function convertEffectTypeToSpecString(str) {
  let specString = str;
  console.log("convertEffectTypeToSpecString", specString);
  specString = convertUnderscoresToSpace(specString);
  console.log(specString);
  specString = toTitleCase(specString);
  console.log(specString);
  return specString;
}

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
function buildSample(effectStyle: EffectStyle) {
  if (!effectStyle) {
    return;
  }

  const effectStyleName = effectStyle.name;
  const effectStyleId = effectStyle.id;
  let effectStyleSpec = "";

  console.log("🎨 ", effectStyleName);
  console.log(effectStyle);

  // Logic to build spec string

  // safety checking
  let isSolid = true;
  let isSingle = true;

  // ignore multi-effect for now
  if (effectStyle.effects.length > 1) {
    isSingle = false;
    effectStyleSpec = "Multiple Fills";
    console.log("multi effect");
  }

  let firstEffect = effectStyle.effects[0];

  if (isSingle) {
    // Effect type
    let effectType = firstEffect.type;
    let effectTypeString = convertEffectTypeToSpecString(effectType);
    effectStyleSpec += effectTypeString;
    effectStyleSpec += ": ";

    // Shadow or Blur?
    if ("color" in firstEffect && (effectType === "DROP_SHADOW" || effectType === "INNER_SHADOW")) {
      // Effect color
      let effectColor = getSpecStringFromRgba(firstEffect.color);
      effectStyleSpec += effectColor;
      effectStyleSpec += " | ";
      // Offset
      let effectOffsetX = firstEffect.offset.x;
      let effectOffsetY = firstEffect.offset.y;
      effectStyleSpec += "Offset: ";
      effectStyleSpec += effectOffsetX;
      effectStyleSpec += ", ";
      effectStyleSpec += effectOffsetY;
      effectStyleSpec += " | ";
      // Spread
      let effectSpread = firstEffect.spread;
      effectStyleSpec += "Spread: ";
      effectStyleSpec += effectSpread;
      effectStyleSpec += " | ";
    } else {
      console.log("blur effect");
    }
    // Blur Radius
    let effectRadius = firstEffect.radius;
    effectStyleSpec += "Blur: ";
    effectStyleSpec += effectRadius;
  }

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
  const colorStyleTitleText = addText(effectStyleName, {
    x: textX,
    y: sampleY,
  });
  // Build spec
  const colorStyleSpecText = addText(effectStyleSpec, {
    x: textX,
    y: sampleY + 14,
  });

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

function buildEffectStyleMasterFrame(paintStylesMasterFrame: FrameNode) {
  paintStylesMasterFrame.layoutMode = "VERTICAL";
  paintStylesMasterFrame.counterAxisSizingMode = "AUTO";
  paintStylesMasterFrame.itemSpacing = 16;
  paintStylesMasterFrame.paddingTop = 32;
  paintStylesMasterFrame.paddingRight = 32;
  paintStylesMasterFrame.paddingBottom = 32;
  paintStylesMasterFrame.paddingLeft = 32;
  return paintStylesMasterFrame;
}

function buildEffectStyleFrames(stylesArray: Array<EffectStyle>, masterFrame: FrameNode) {
  console.log("inside buildEffectStyleFrames");
  let effectStyleFrames = stylesArray.map((x, i) => {
    const effectStyleFrame = buildSample(x);
    effectStyleFrame.y = i * (64 + 16);
    masterFrame.appendChild(effectStyleFrame);
    return effectStyleFrame;
    // console.log("effectStyle ", i, ": ", x);
  });
  // console.log("effectStyleFrames", effectStyleFrames);

  return effectStyleFrames;
}

async function generateLocalEffectStylesDoc(mainFrame: FrameNode) {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // create a frame to fill/reuse
  const frame = getStoredFrame("EffectStylesFrame") as FrameNode;

  // Get effect styles
  const localEffectStyles = figma.getLocalEffectStyles();
  console.log("localEffectStyles", localEffectStyles);

  // SETUP MASTER ARTBOARD
  const effectStylesMasterFrame = buildEffectStyleMasterFrame(frame);

  // Add header
  const effectStylesHeader = figma.createText();
  effectStylesHeader.characters = "Effect Styles";
  effectStylesMasterFrame.appendChild(effectStylesHeader);

  /*
   */

  console.log("before buildEffectStyleFrames");

  // Build the style frames and append them to the master artboard
  let effectStyleFrames = buildEffectStyleFrames(localEffectStyles, effectStylesMasterFrame);
  mainFrame.appendChild(effectStylesMasterFrame);
}

export { generateLocalEffectStylesDoc };
