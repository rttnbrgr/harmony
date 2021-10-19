import { createPaintStyle } from "./createStyles/createPaintStyle";
import { createEffectStyle } from "./createStyles/createEffectStyle";
import { createTextStyle } from "./createStyles/createTextStyle";

export async function generateLayerStyles() {
  console.log("in it");
  const page = figma.currentPage;

  // if nothing is selected, return message
  if (page.selection?.length === 0) {
    console.warn("please make sure you select something");
  }

  // if there is a selection, loop over selection to determine possible layer styles
  page.selection.forEach(async (element) => {
    console.log("element", element);

    switch (element.type) {
      case "RECTANGLE":
      case "ELLIPSE":
      case "POLYGON":
      case "STAR":
        // paint style
        createPaintStyle(element);

        // effect style
        createEffectStyle(element);
        break;

      case "LINE":
        // paint style
        createPaintStyle(element);

        // effect style
        createEffectStyle(element);
        break;

      case "TEXT":
        // paint style
        createPaintStyle(element);

        // effect style
        createEffectStyle(element);

        // text style
        await createTextStyle(element);
        break;
    }
  });
}
