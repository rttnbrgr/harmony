import { getSpecString } from "./getSpec";
import { addText } from "./utils";

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
export async function buildColorStyleBlock(paintStyle: PaintStyle) {
  // Destruct + generate the spec string
  const { name: paintStyleName, id: paintStyleId, paints } = paintStyle;
  let paintStyleSpec = getSpecString(paintStyle);

  // put it here
  const sampleX = 400;
  const sampleY = 0;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  // build the rect
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.x = sampleX;
  colorStyleRect.y = sampleY;
  colorStyleRect.fillStyleId = paintStyleId;
  colorStyleRect.resize(rectSize, rectSize);
  colorStyleRect.cornerRadius = spacer;
  figma.currentPage.appendChild(colorStyleRect);

  // Build title
  const colorStyleTitleText = await addText(paintStyleName, {
    x: textX,
    y: sampleY,
  });
  // Build spec
  const colorStyleSpecText = await addText(paintStyleSpec, {
    x: textX,
    y: sampleY + 14,
  });

  // Create the frame, append text + rect, position it
  const sampleFrame = figma.createFrame();
  sampleFrame.appendChild(colorStyleRect);
  sampleFrame.layoutMode = "HORIZONTAL";
  sampleFrame.itemSpacing = 8;
  sampleFrame.counterAxisAlignItems = "CENTER";
  sampleFrame.x = sampleX;

  // Pretty sure this is not necessary; build style frames handles it?
  return Promise.all([colorStyleTitleText, colorStyleSpecText]).then((value) => {
    console.log("colorStyleTitleText promise", value);
    console.log("sampleFrame", sampleFrame);

    // Group text nodes
    const textGroup = figma.group([...value], figma.currentPage);
    console.log("textGroup", textGroup);

    // Sample frame updates, that depend on promises; Append text group
    sampleFrame.appendChild(textGroup);

    // Sample frame size stuff
    let getSampleFrameWidth = () => sampleFrame.width;
    let sampleFrameWidth = getSampleFrameWidth();

    // Resize
    sampleFrame.resizeWithoutConstraints(sampleFrameWidth, rectSize);

    return sampleFrame;
  });
}
