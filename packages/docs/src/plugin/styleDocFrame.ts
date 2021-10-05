import { getStoredFrame } from "./frameHelpers";
import { FigmaDocsFrame } from "./types";

/**
 * Setup the layout/styles for a doc frame
 * @param frame Style doc frame
 */
function applyStyleDocFrameStyles(frame: FrameNode) {
  frame.layoutMode = "VERTICAL";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = 16;
  frame.paddingTop = 32;
  frame.paddingRight = 32;
  frame.paddingBottom = 32;
  frame.paddingLeft = 32;
  return frame;
}

/**
 * This is how we standup our style doc frames.
 * ------
 * Get the frame (create it if none exists).
 * Remove its childern.
 * Set the default styles for the style doc frame.
 *
 * @param frameName One
 * @returns {Frame}
 */
export function boostrapStyleDocFrame(frameName: FigmaDocsFrame) {
  // Get the frame
  const frame = getStoredFrame(frameName) as FrameNode;
  // remove previous children
  frame.children.map((child) => child.remove());
  // Apply base styles
  applyStyleDocFrameStyles(frame);
  // Return the frame
  return frame;
}