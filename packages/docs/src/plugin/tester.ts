import { buildPaintStyleSpecString } from "./getSpec";

// Print a string
function buildText(str = "Build Text String", y = 0) {
  console.log("buildText");
  // const newPromise = await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  const TEXT_NODE = figma.createText();
  TEXT_NODE.characters = str;
  TEXT_NODE.y = y;
  figma.currentPage.appendChild(TEXT_NODE);

  console.log("text appended");
}

const defaultRectFills: Array<Paint> = [{ type: "SOLID", color: { r: 1, g: 0, b: 0.5 } }];

function buildRect(fills = defaultRectFills, y = 0) {
  const rect = figma.createRectangle();
  rect.x = -20;
  rect.y = y;
  rect.fills = fills;
  rect.resize(10, 10);
  figma.currentPage.appendChild(rect);
  // nodes.push(rect);
}

// get all layer styles
const localPaintStyles = figma.getLocalPaintStyles();
// console.log("localPaintStyles", localPaintStyles);
// filter by solid]

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

async function testerFunc() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // get the styles
  const localPaintStyles = figma.getLocalPaintStyles();

  // print them
  localPaintStyles.map((x, i) => {
    console.log(i, x);
    let verticalOffset = 20 * i;

    if (i === 5) {
      buildText("Not a solid color", verticalOffset);
      return;
    }

    let string = buildPaintStyleSpecString(x);
    buildText(string, verticalOffset);
    const paintsClone = clone(x.paints);
    buildRect(paintsClone, verticalOffset);
  });
  // with hex
  // with name
  // frame them
  // put them in an auto group
}

export { testerFunc };
