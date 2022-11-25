import { deriveRgbValue, isInt, convertUnderscoresToSpace, toTitleCase, addText } from "./utils";

function getSpecStringFromRgba(color: RGBA) {
  let rgbaString = "";
  const r = deriveRgbValue(color.r);
  const g = deriveRgbValue(color.g);
  const b = deriveRgbValue(color.b);
  const a = isInt(color.a) ? color.a : color.a.toFixed(2);
  rgbaString = `[${r}, ${g}, ${b}, ${a}]`;
  return rgbaString;
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
export async function buildSample(effectStyle: EffectStyle) {
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
  const colorStyleTitleText = await addText(effectStyleName, {
    x: textX,
    y: sampleY,
  });
  // Build spec
  const colorStyleSpecText = await addText(effectStyleSpec, {
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
