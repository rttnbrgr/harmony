export function getStoredFrame(frameName: string) {
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
