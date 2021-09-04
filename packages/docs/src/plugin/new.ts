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

export const DOC_BLOCK_ROOT: string = "DocBlockComponent";
export const DOC_BLOCK_SWATCH: string = "DocBlockSwatch";
export const DOC_BLOCK_TITLE: string = "DocBlockTitle";
export const DOC_BLOCK_SPEC: string = "DocBlockSpec";

export function buildComponentStyleSwatch() {
  console.log("👋 buildComponentStyleSwatch", figma.viewport);
  // figma.viewport.center

  /**
   * Config values
   */
  const sampleX = figma.viewport.center.x;
  const sampleY = figma.viewport.center.y;
  const spacer = 8;
  const rectSize = spacer * 8;
  const textX = sampleX + rectSize + spacer;

  /**
   * Build the pieces
   */

  // Build the swatch
  // && put it in the cnter of the page
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.resize(rectSize, rectSize);
  colorStyleRect.cornerRadius = spacer;
  // figma.currentPage.appendChild(colorStyleRect);
  console.log("colorStyleRect", colorStyleRect);

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

  /**
   * Build the component itself
   */

  // Create it
  const sampleComponent = figma.createComponent();

  // Give it a name
  sampleComponent.name = "Doc Block";
  // Save it
  figma.root.setPluginData(DOC_BLOCK_ROOT, sampleComponent.id);

  // Add component children
  sampleComponent.appendChild(colorStyleRect);
  sampleComponent.appendChild(textGroup);

  // Save teh children refs
  sampleComponent.setPluginData(DOC_BLOCK_SWATCH, colorStyleRect.id);
  sampleComponent.setPluginData(DOC_BLOCK_TITLE, TitleText.id);
  sampleComponent.setPluginData(DOC_BLOCK_SPEC, SpecText.id);

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
