import { getCurrentPageEdgeRight } from "./frameHelpers";

/**
 * Setup the layout/styles for our main frame
 * @param mainFrame Reference to the main frame
 */
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

/**
 * Position the main frame, on the current page to the farthest right and top point
 * @param mainFrame Reference to the main frame
 */
export function positionMainFrame(mainFrame: FrameNode) {
  const horizontalOffset = 100;
  const verticalOffset = 0;

  const edges = getCurrentPageEdgeRight(mainFrame);

  // Set mainframe position
  mainFrame.x = edges.x + horizontalOffset;
  mainFrame.y = edges.y + verticalOffset;
}
