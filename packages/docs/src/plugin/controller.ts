import { MAIN_FRAME_KEY } from "./types";
import generateLocalPaintStylesDoc from "./generateColorStyles";
import generateLocalEffectStylesDoc from "./generateEffectStyles";
import { getStoredFrame, positionMainFrame } from "./helpers";
import generateLocalTextStylesDoc from "./generateTextStyles";

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// Setup the frame first
const mainFrame = getStoredFrame(MAIN_FRAME_KEY) as FrameNode;

if (figma.command === "CONFIG") {
  console.log("CONFIG");

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__);
  figma.ui.resize(400, 300);

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = (msg) => {
    if (msg.type.includes("CANCEL")) {
      figma.closePlugin();
      return;
    }

    for (let index = 0; index < msg.type.length; index++) {
      const element = msg.type[index];

      switch (element) {
        case "CREATE_COLOR_STYLES":
          generateLocalPaintStylesDoc(mainFrame);
          break;

        case "CREATE_EFFECT_STYLES":
          generateLocalEffectStylesDoc(mainFrame);
          break;

        case "CREATE_TEXT_STYLES":
          generateLocalTextStylesDoc(mainFrame);
          break;

        default:
          break;
      }
    }

    positionMainFrame(mainFrame);

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  };
}

if (figma.command === "BUILD_PAINT_STYLES") {
  const paintStylePromise = generateLocalPaintStylesDoc(mainFrame);
  /*
   * Commands should close the plugin
   * Leaving this commented out for debug purposes
   *
   * figma.closePlugin();
   **/
  Promise.all([paintStylePromise]).then((v) => {
    figma.viewport.scrollAndZoomIntoView([mainFrame]);
    figma.closePlugin();
  });
}

if (figma.command === "BUILD_TEXT_STYLES") {
  const textStylePromise = generateLocalTextStylesDoc(mainFrame);
  Promise.all([textStylePromise]).then((v) => {
    figma.viewport.scrollAndZoomIntoView([mainFrame]);
    figma.closePlugin();
  });
}

if (figma.command === "BUILD_EFFECT_STYLES") {
  const effectStylePromise = generateLocalEffectStylesDoc(mainFrame);
  Promise.all([effectStylePromise]).then((v) => {
    console.log("promise.all", v);
    figma.viewport.scrollAndZoomIntoView([mainFrame]);
    figma.closePlugin();
  });
}

if (figma.command === "BUILD_ALL_STYLES") {
  const textStylePromise = generateLocalTextStylesDoc(mainFrame);
  const paintStylePromise = generateLocalPaintStylesDoc(mainFrame);
  const effectStylePromise = generateLocalEffectStylesDoc(mainFrame);
  Promise.all([paintStylePromise, textStylePromise, effectStylePromise]).then((v) => {
    figma.viewport.scrollAndZoomIntoView([mainFrame]);
    figma.closePlugin();
  });
}
