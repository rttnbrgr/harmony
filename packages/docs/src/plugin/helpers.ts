import { FigmaDocsFrame } from "./types";

export const MAIN_FRAME_KEY = "MainFrame";

export function getStoredFrame(frameName: FigmaDocsFrame) {
  console.log("getStoredFrame");
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);

  if (!frameId || !frame) {
    console.log("no frame", frameId, frame);
    const newFrame = figma.createFrame();
    figma.root.setPluginData(frameName, newFrame.id);

    /**
     * For the Main frame:
     * Considered moving this to its own function
     * but it shares all of the logic
     * just adds an additional position + style bootstrap
     */
    if (frameName === MAIN_FRAME_KEY) {
      positionMainFrame(newFrame);
      applyMainFrameStyles(newFrame);
    }

    return newFrame;
  }

  return frame;
}

export function applyMainFrameStyles(mainFrame: FrameNode) {
  console.log("applyMainFrameStyles");
  console.log("mainFrame", mainFrame);
  mainFrame.layoutMode = "HORIZONTAL";
  mainFrame.counterAxisSizingMode = "AUTO";
  mainFrame.itemSpacing = 16;
  mainFrame.paddingTop = 32;
  mainFrame.paddingRight = 32;
  mainFrame.paddingBottom = 32;
  mainFrame.paddingLeft = 32;
}

export function applyStyleFrameStyles(frameName: FigmaDocsFrame) {
  const frame = getStoredFrame(frameName) as FrameNode;
  // remove previous children
  frame.children.map((child) => child.remove());

  // new styles
  frame.layoutMode = "VERTICAL";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = 16;
  frame.paddingTop = 32;
  frame.paddingRight = 32;
  frame.paddingBottom = 32;
  frame.paddingLeft = 32;
  return frame;
}

// This shouldnt run if the frame exists
// Position the frame to the farthest right and top point
export function positionMainFrame(mainFrame: FrameNode) {
  const horizontalOffset = 100;
  const verticalOffset = 0;

  let x = null;
  let y = null;

  const currentPage: PageNode = figma.currentPage;

  // Traverse nodes to find edges
  currentPage.children
    // make sure we don't count the mainFrame
    .filter((child) => {
      return child?.id !== mainFrame.id;
    })
    // Find the farthest right node + its width && Find the top most point
    .forEach((child) => {
      const potentialX = child.x + child.width;
      const potentialY = child.y;
      x = x ? Math.max(x, potentialX) : potentialX;
      y = y ? Math.min(y, potentialY) : potentialY;
    });

  // Set mainframe position
  mainFrame.x = x + horizontalOffset;
  mainFrame.y = y + verticalOffset;
}

export async function addHeaderToFrame(headerText: string, frame: FrameNode) {
  const textStylesHeader = figma.createText();
  await figma.loadFontAsync(textStylesHeader.fontName as FontName);
  textStylesHeader.characters = headerText;
  frame.appendChild(textStylesHeader);
}

export async function buildStyleFrames<StyleType>(
  stylesArray: Array<StyleType>,
  frame: FrameNode,
  buildSample: (styleType: StyleType) => Promise<FrameNode>,
  offsets: { x: number; y: number } = { x: null, y: null }
) {
  const promiseArray = stylesArray.map(async (styleType, i) => {
    const styleFrameItem = await buildSample(styleType);
    if (offsets.x) {
      styleFrameItem.x = i * offsets.x;
    }
    if (offsets.y) {
      styleFrameItem.y = i * offsets.y;
    }

    // add to StyleFrame
    frame.appendChild(styleFrameItem);
  });

  // Need to resolve all promises to expost to outer scope?
  return Promise.all([...promiseArray]).then((value) => {
    return true;
  });
}
