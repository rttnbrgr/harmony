import { applyMainFrameStyles, positionMainFrame } from "./mainFrame";
import { MAIN_FRAME_KEY, FigmaDocsFrame, DocBlockNodes } from "./types";

/**
 * Check if a figma frame exists
 * @constructor
 * @param {FigmaDocsFrame} frameName - One of our stored frames
 * @returns {boolean}
 */
export function storedFrameExists(frameName: FigmaDocsFrame | DocBlockNodes) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);
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
 * @param {FigmaDocsFrame} frameName - One of our stored frames
 * @returns {BaseNode} - The requested frame
 */
export function getStoredFrame(frameName: FigmaDocsFrame | DocBlockNodes) {
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

// duplicates getStoredFrame
// but
// doesnt try to create a frame if it doesnt exist
export function getStoredNode(frameName: FigmaDocsFrame | DocBlockNodes) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);

  return frame;
}

export function getCurrentPageEdgeRight(excludeFrame: FrameNode = null) {
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
