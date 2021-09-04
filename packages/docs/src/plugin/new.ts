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

export function buildComponentStyleSwatch() {
  console.log("👋 buildComponentStyleSwatch", figma.viewport);
  // figma.viewport.center

  /**
   * Build the symbol
   */

  // build a rect
  // put it here
  // const sampleX = 400;
  // const sampleY = 0;
  const sampleX = figma.viewport.center.x;
  const sampleY = figma.viewport.center.y;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  // build the rect
  // && put it in the cnter of the page
  const colorStyleRect = figma.createRectangle();
  // colorStyleRect.x = sampleX;
  // colorStyleRect.y = sampleY;
  // colorStyleRect.fillStyleId = paintStyleId;
  colorStyleRect.resize(rectSize, rectSize);
  colorStyleRect.cornerRadius = spacer;
  // figma.currentPage.appendChild(colorStyleRect);

  // Build title
  const TitleText = figma.createText();
  TitleText.characters = "Style Title";

  // Build spec
  const SpecText = figma.createText();
  SpecText.characters = "Style Spec";
  // need to add autolayout
  SpecText.y = 14;

  // create teh text group
  const textGroup = figma.group([TitleText, SpecText], figma.currentPage);

  // Create the frame, append text + rect, position it
  const sampleComponent = figma.createComponent();

  // Add component children
  sampleComponent.appendChild(colorStyleRect);
  sampleComponent.appendChild(textGroup);

  // Component Config Opinions
  sampleComponent.layoutMode = "HORIZONTAL";
  sampleComponent.itemSpacing = 8;
  sampleComponent.counterAxisAlignItems = "CENTER";
  sampleComponent.x = sampleX;
  let getSampleFrameWidth = () => sampleComponent.width;
  let sampleFrameWidth = getSampleFrameWidth();

  sampleComponent.resizeWithoutConstraints(sampleFrameWidth, rectSize);
  // console.log("sampleFrame", sampleFrame);
}
