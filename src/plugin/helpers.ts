import { FrameName } from "./types";

export function getStoredFrame(frameName: FrameName) {
  const frameId = figma.root.getPluginData(frameName);
  const frame = figma.getNodeById(frameId);

  if (!frameId || !frame) {
    const frame = figma.createFrame();
    figma.root.setPluginData(frameName, frame.id);
    positionMainFrame(frame);
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

// This shouldnt run if the frame exists
// Position the frame to the farthest right and top point
export function positionMainFrame(mainFrame: FrameNode) {
  const horizontalOffset = 100;
  const verticalOffset = 0;

  let x = 0;
  let y = 0;

  const currentPage: PageNode = figma.currentPage;

  // Traverse nodes to find edges
  currentPage.children
    // make sure we don't count the mainFrame
    .filter((child) => {
      console.log("child", child);
      return child?.id !== mainFrame.id;
    })
    // find the farthest right node + its width
    // Find the top most point
    .forEach((child) => {
      console.log("child2", child);
      console.log("x, child, width", x, child.x, child.width);
      console.log("y, child, height", y, child.y, child.height);
      x = Math.max(x, child.x + child.width);
      y = Math.min(y, child.y);
    });

  console.log("x, y", x, y);
  console.log("figma.root.children", figma.root.children);

  // Set mainframe position
  mainFrame.x = x + horizontalOffset;
  mainFrame.y = y + verticalOffset;
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
