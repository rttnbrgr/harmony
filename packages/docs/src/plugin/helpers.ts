import { FrameName } from "./types";

export const MAIN_FRAME_KEY = "MainFrame";

/**
 * Check if a figma frame exists
 * @constructor
 * @param {FrameName} frameName - One of our stored frames
 * @returns {boolean}
 */
export function storedFrameExists(frameName: FrameName) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);
  console.log("frameId", frameId);
  console.log("frame", frame);
  return !!frameId && !!frame;
}

/**
 * Gets the requested frame.
 * If the frame does not exist, it will be created and the provided name
 * will be stored in the plugin data store.
 *
 * Since we are returning a frame we don't have any way to inject any bootstrap
 * steps (things that should run only once once the frame is created). For this
 * reason, we have some hardcoded boostrap steps here for the MAIN_FRAME
 *
 * @param {FrameName} frameName - One of our stored frames
 * @returns {BaseNode} - The requested frame
 */
export function getStoredFrame(frameName: FrameName) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);

  if (!frameId || !frame) {
    // console.log("🙅‍♂️ no frame frameName", frameId, frame);
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

export function boostrapStyleDocFrame(frameName: FrameName) {
  // Get the frame
  const frame = getStoredFrame(frameName) as FrameNode;
  // remove previous children
  frame.children.map((child) => child.remove());
  // Apply base styles
  applyStyleDocFrameStyles(frame);
  // Return the frame
  return frame;
}

function getCurrentPageEdgeRight(excludeFrame: FrameNode = null) {
  let x = null;
  let y = null;

  const currentPage: PageNode = figma.currentPage;

  // Traverse nodes to find edges
  currentPage.children
    // make sure we don't count this included frame
    .filter((child) => {
      return excludeFrame ? child?.id !== excludeFrame.id : child;
    })
    // Find the farthest right node + its width && Find the top most point
    .forEach((child) => {
      const potentialX = child.x + child.width;
      const potentialY = child.y;
      x = x ? Math.max(x, potentialX) : potentialX;
      y = y ? Math.min(y, potentialY) : potentialY;
    });

  const edges = {
    x: x,
    y: y,
  };

  return edges;
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

/**
 * Simple utility to prepend text to a frame.
 * @param headerText Text to prepend to the frame
 * @param frame Frame for text to be prepended to
 */
export function addHeaderToFrame(headerText: string, frame: FrameNode) {
  const textStylesHeader = figma.createText();
  textStylesHeader.characters = headerText;
  frame.appendChild(textStylesHeader);
}

export function buildStyleFrames<StyleType>(
  stylesArray: Array<StyleType>,
  frame: FrameNode,
  buildSample: (styleType: StyleType) => FrameNode,
  offsets: { x: number; y: number } = { x: null, y: null }
) {
  stylesArray.forEach((styleType, i) => {
    const styleFrameItem = buildSample(styleType);
    if (offsets.x) {
      styleFrameItem.x = i * offsets.x;
    }
    if (offsets.y) {
      styleFrameItem.y = i * offsets.y;
    }

    // add to StyleFrame
    frame.appendChild(styleFrameItem);
  });
}
