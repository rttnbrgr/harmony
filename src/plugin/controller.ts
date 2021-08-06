import { generateLocalPaintStylesDoc } from "./colorStyles";
import { generateLocalEffectStylesDoc } from "./effectStyles";
import { applyMainFrameStyles, getStoredFrame, positionMainFrame } from "./helpers";
import { generateLocalTextStylesDoc } from "./textStyles";

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// Setup the frame first
const mainFrame = getStoredFrame("MainFrame") as FrameNode;
applyMainFrameStyles(mainFrame);

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
          console.log("create color styles");
          generateLocalPaintStylesDoc(mainFrame);
          break;

        case "CREATE_EFFECT_STYLES":
          console.log("create effect styles");
          generateLocalEffectStylesDoc(mainFrame);
          break;

        case "CREATE_TEXT_STYLES":
          console.log("create text styles");
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
  console.log("create color styles");
  generateLocalPaintStylesDoc(mainFrame);
  /*
   * Commands should close the plugin
   * Leaving this commented out for debug purposes
   *
   * figma.closePlugin();
   **/
}

if (figma.command === "BUILD_TEXT_STYLES") {
  console.log("create text styles");
  generateLocalTextStylesDoc(mainFrame);
  // figma.closePlugin();
}

if (figma.command === "BUILD_EFFECT_STYLES") {
  console.log("create effect styles");
  generateLocalEffectStylesDoc(mainFrame);
  // figma.closePlugin();
}

if (figma.command === "BUILD_ALL_STYLES") {
  console.log("create ALL styles");
  generateLocalTextStylesDoc(mainFrame);
  generateLocalPaintStylesDoc(mainFrame);
  generateLocalEffectStylesDoc(mainFrame);
  // figma.closePlugin();
}

// Global logs
// console.log("console", console);
// console.log("figma", figma);

// Run these automatically when plugin starts
// generateLocalPaintStylesDoc();
// generateLocalEffectStylesDoc();
// generateLocalTextStylesDoc();
