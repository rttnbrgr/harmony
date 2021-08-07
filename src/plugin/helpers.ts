import { FrameName } from "./types";

export function getStoredFrame(frameName: FrameName) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);

  if (!frameId || !frame) {
    const frame = figma.createFrame();
    figma.root.setPluginData(frameName, frame.id);
    return frame;
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

export function applyStyleFrameStyles(frameName: FrameName) {
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

export function positionMainFrame(mainFrame: FrameNode) {
  let x = 0;
  // TODO JT find the current/selected page
  (figma.getNodeById(figma.root.children[0].id) as PageNode).children
    // make sure we don't count the mainFrame
    .filter((child) => child?.id !== mainFrame.id)
    // find the farthest right node + its width
    .forEach((child) => (x = Math.max(x, child.x + child.width)));
  mainFrame.x = x + 100;
  figma.viewport.scrollAndZoomIntoView([mainFrame]);
}

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
