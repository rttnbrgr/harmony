import { getSpecString } from "./getSpec";
import { addText } from "./utils";

// Takes a paint style and returns a frame documenting that style
// function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
export async function buildTextStyleBlock(textStyle: TextStyle) {
  // Destruct + generate the spec string
  const { name: textStyleName, id: textStyleId } = textStyle;
  let textStyleSpec = getSpecString(textStyle);

  // put it here
  const sampleX = 400;
  const sampleY = 0;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  // Build title
  const textStyleTitleText = await addText(textStyleName, {
    x: textX,
    y: sampleY,
  });
  textStyleTitleText.textStyleId = textStyleId;

  // Build spec
  const textStyleSpecText = await addText(textStyleSpec, {
    x: textX,
    y: sampleY + 14,
  });

  // Create the frame, append text + rect, position it
  const sampleFrame = figma.createFrame();
  sampleFrame.appendChild(textStyleTitleText);
  sampleFrame.appendChild(textStyleSpecText);
  sampleFrame.layoutMode = "VERTICAL";
  sampleFrame.itemSpacing = 8;
  sampleFrame.counterAxisSizingMode = "AUTO";
  sampleFrame.counterAxisAlignItems = "MIN";
  sampleFrame.x = sampleX;
  let getSampleFrameWidth = () => sampleFrame.width;
  let sampleFrameWidth = getSampleFrameWidth();

  sampleFrame.resizeWithoutConstraints(sampleFrameWidth, rectSize);

  return sampleFrame;
}
