import _isEqual from "lodash/isEqual";

export function createPaintStyle(element) {
  // check if paint style exists
  if (element.fillStyleId) {
    console.log("paintStyle exists", element.fillStyleId);
  } else if (element.fills) {
    // create paint style
    const paintStyle = figma.createPaintStyle();
    paintStyle.name = element.name;

    if (element.strokes?.length) {
      console.log("yup");
      paintStyle.paints = element.strokes;
      element.strokeStyleId = paintStyle.id + "_stroke";
      console.log("paintStyle", paintStyle);
    }
    paintStyle.paints = [...(paintStyle.paints ?? []), ...element.fills];
    element.fillStyleId = paintStyle.id;

    // check if there is a layer style like this already
    // const { id, name, ...rest } = paintStyle;
    // const existingPaintStyles = figma.getLocalPaintStyles();
    // console.log("rest", rest);
    // console.log("existingPaintStyles", existingPaintStyles);
    // const isDuplicate = existingPaintStyles?.some((localPaintStyle) => {
    //   console.log("localPaintStyle", localPaintStyle);
    //   return paintStyle.paints === localPaintStyle.paints;
    //   // //   return true;
    //   //     return _isEqual(paintStyle, rest);
    // });

    // console.log("isDuplicate", isDuplicate);
  }
}
