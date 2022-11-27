import { MAIN_FRAME_KEY, FigmaDocsFrame } from "./types";

/**
 * Check if a figma frame exists
 */
export function storedFrameExists(frameName: FigmaDocsFrame) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);
  return !!frameId && !!frame;
}

export function getStoredFrame(frameName: FigmaDocsFrame) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);

  if (!frameId || !frame) {
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
  mainFrame.layoutMode = "HORIZONTAL";
  mainFrame.counterAxisSizingMode = "AUTO";
  mainFrame.itemSpacing = 16;
  mainFrame.paddingTop = 32;
  mainFrame.paddingRight = 32;
  mainFrame.paddingBottom = 32;
  mainFrame.paddingLeft = 32;
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
