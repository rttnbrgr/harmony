/*
*/
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

console.log('console', console)
console.log('figma', figma)
// get all colors on the page
// print them with a hex value
// check which ones match a layer style




// Print a string
function buildText(str = 'Build Text String', y = 0) {
  console.log('buildText')
  // const newPromise = await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  const TEXT_NODE = figma.createText();
  TEXT_NODE.characters = str;
  TEXT_NODE.y = y;
  figma.currentPage.appendChild(TEXT_NODE);

  console.log('text appended')
}

const defaultRectFills: Array<Paint> = [{type: 'SOLID', color: {r: 1, g: 0, b: 0.5}}]

function buildRect(fills = defaultRectFills, y = 0) {
  const rect = figma.createRectangle();
  rect.x = -20;
  rect.y = y;
  rect.fills = fills;
  rect.resize(10, 10);
  figma.currentPage.appendChild(rect);
  // nodes.push(rect);
}

const deriveRgbValue = val => Math.round(val * 255); 
const getRgbStringFromLocalStyle = style => {
    // limit to single fill
    const rgbObject = style.paints[0].color;
    const r = `R: ${deriveRgbValue(rgbObject.r)}`;
    const g = `G: ${deriveRgbValue(rgbObject.g)}`;
    const b = `B: ${deriveRgbValue(rgbObject.b)}`;
    return `[ ${r} ${g} ${b}]`
}

function buildPaintStyleVisual(style: PaintStyle, verticalOffset: number) {

  let paintStyleString;
  paintStyleString = style.name;
  paintStyleString += ' - ';
  // const deriveRgbValue = val => Math.round(val * 255);
  // const getRgbStringFromLocalStyle = style => {
  //   // limit to single fill
  //   const rgbObject = style.paints[0].color;
  //   const r = `R: ${deriveRgbValue(rgbObject.r)}`;
  //   const g = `G: ${deriveRgbValue(rgbObject.g)}`;
  //   const b = `B: ${deriveRgbValue(rgbObject.b)}`;
  //   return `[ ${r} ${g} ${b}]`
  // }
  paintStyleString += getRgbStringFromLocalStyle(style);
  console.log(paintStyleString);

  buildText(paintStyleString, verticalOffset);
  const paintsClone = clone(style.paints);
  buildRect(paintsClone, verticalOffset);

}

// const rectFactory = (fill = defaultRectFill) => {
//   const rect = figma.createRectangle();
//   rect.x = 150;
//   rect.fills = [fill];
//   figma.currentPage.appendChild(rect);
//   // nodes.push(rect);
// }

// get all layer styles
const localPaintStyles = figma.getLocalPaintStyles();
console.log('localPaintStyles', localPaintStyles);
// filter by solid]

function clone(val) {
  return JSON.parse(JSON.stringify(val))
}

async function loadDefaultFont() {
  console.log('loadDefaultFont');
  const fontPromise = await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  console.log('after font promise');
  // fontPromise.resolve(x => {console.log('font promise', x)})
  // buildText()
  // buildText('hi')
  // buildText('two')

  // print them
  localPaintStyles.map((x,i ) => {

    console.log(i, x)
    let verticalOffset = 20 * i;
    
    if(i === 5) {
      buildText('Not a solid color', verticalOffset);
      return;
    }

    let string;
    string = x.name;
    string += ' - ';
    const deriveRgbValue = val => Math.round(val * 255);
    const getRgbStringFromLocalStyle = style => {
      // limit to single fill
      const rgbObject = style.paints[0].color;
      const r = `R: ${deriveRgbValue(rgbObject.r)}`;
      const g = `G: ${deriveRgbValue(rgbObject.g)}`;
      const b = `B: ${deriveRgbValue(rgbObject.b)}`;
      return `[ ${r} ${g} ${b}]`
    }
    string += getRgbStringFromLocalStyle(x);
    console.log(string);
    buildText(string, verticalOffset);
    const paintsClone = clone(x.paints);
    // buildRect([{type: 'SOLID', color: {r: 1, g: 0.5, b: 1}}], verticalOffset);
    // buildRect(paintsClone, verticalOffset + 5);
    buildRect(paintsClone, verticalOffset);
    // buildRect(defaultRectFills, verticalOffset);
  })
  // with hex
  // with name
  // frame them
  // put them in an auto group


}






// create a sample doc




loadDefaultFont();

const samplePaintStyle = localPaintStyles[1];

// build a new visual
function buildSample(paintStyle: PaintStyle = samplePaintStyle) {
  // const fontPromise = await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  
  // get paint style things
  console.log(paintStyle);
  const paintStyleName = paintStyle.name;
  const paintStyleId = paintStyle.id;
  // safety checking
  let isSolid = true;
  let isSingleFill = true;
  if(paintStyle.paints.length > 1) {
    isSingleFill = false;
  }
  if(isSingleFill && paintStyle.paints[0].type !== 'SOLID') {
    isSolid = false;
  }

  // put it here
  const sampleX = 400;
  const sampleY = 0;
  const spacer = 8;
  const rectSize = spacer * 8;
  const styleSpec = 'RGB: 255, 127, 0';
  const textX = sampleX + rectSize + spacer;

  // build the rect
  const colorStyleRect = figma.createRectangle();
  colorStyleRect.x = sampleX;
  colorStyleRect.y = sampleY;
  colorStyleRect.fillStyleId = paintStyleId;
  colorStyleRect.resize(rectSize, rectSize);
  colorStyleRect.cornerRadius = spacer;
  figma.currentPage.appendChild(colorStyleRect);

  //
  const textNodes: SceneNode[] = [];  

  // build text row one
  const colorStyleTitleText = figma.createText();
  colorStyleTitleText.characters = paintStyleName;
  colorStyleTitleText.x = textX;
  colorStyleTitleText.y = sampleY;
  figma.currentPage.appendChild(colorStyleTitleText);
  
  // build text row two
  const colorStyleSpecText = figma.createText();
  colorStyleSpecText.characters = styleSpec;
  colorStyleSpecText.x = textX;
  colorStyleSpecText.y = sampleY + 14;
  figma.currentPage.appendChild(colorStyleSpecText);

  // select text nodes and group
  textNodes.push(colorStyleTitleText);
  textNodes.push(colorStyleSpecText);
  figma.currentPage.selection = textNodes;
  console.log('selection', figma.currentPage.selection);
  const textGroup = figma.group(figma.currentPage.selection, figma.currentPage);
  
  const newNodes: SceneNode[] = [textGroup, colorStyleRect];  
  // newNodes.push(textGroup);
  // newNodes.push(colorStyleRect);
  figma.currentPage.selection = newNodes;
  console.log('selection', figma.currentPage.selection);
  console.log('figma', figma);

  const sampleFrame = figma.createFrame();
  sampleFrame.appendChild(colorStyleRect);
  sampleFrame.appendChild(textGroup);
  sampleFrame.layoutMode = 'HORIZONTAL';
  sampleFrame.itemSpacing = 8;
  sampleFrame.counterAxisAlignItems = 'CENTER';
  sampleFrame.x = sampleX;
  let getSampleFrameWidth = () => sampleFrame.width;
  let sampleFrameWidth = getSampleFrameWidth();

  sampleFrame.resizeWithoutConstraints(sampleFrameWidth, rectSize);
  console.log('sampleFrame', sampleFrame)

  return sampleFrame;

}


async function loadingFontsWrapper() {
  const fontPromise = await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  buildSample();
  
  // let paintStyleFrames = localPaintStyles.map((x,i ) => {
  //   const paintStyleFramePromise = buildSample(x);
  //   paintStyleFramePromise.then(frame => {
  //     frame.y = i * (64 + 16);
  //     console.log('after the then')
  //   })
  //   console.log('after the promise')
  //   // return 'x';
  // }
}

loadingFontsWrapper()

// const defaultRectFill: Paint = {type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}

// const rectFactory = (fill = defaultRectFill) => {
//   const rect = figma.createRectangle();
//   rect.x = 150;
//   rect.fills = [fill];
//   figma.currentPage.appendChild(rect);
//   // nodes.push(rect);
// }