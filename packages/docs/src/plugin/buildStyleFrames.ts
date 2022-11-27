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
