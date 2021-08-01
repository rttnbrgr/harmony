import { generateLocalPaintStylesDoc } from "./colorStyles";
import { generateLocalEffectStylesDoc } from "./effectStyles";
import { testerFunc } from "./test";
import { generateLocalTextStylesDoc } from "./textStyles";

/*
 */
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

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
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "create-rectangles") {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  for (let index = 0; index < msg.type.length; index++) {
    const element = msg.type[index];

    switch (element) {
      case "CREATE_COLOR_STYLES":
        console.log("create color styles");
        generateLocalPaintStylesDoc();
        break;

      case "CREATE_EFFECT_STYLES":
        console.log("create effect styles");
        generateLocalEffectStylesDoc();
        break;

      case "CREATE_TEXT_STYLES":
        console.log("create text styles");
        generateLocalTextStylesDoc();
        break;

      case "TESTER":
        testerFunc();
        break;

      default:
        break;
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

// Global logs
// console.log("console", console);
// console.log("figma", figma);

// Run these automatically when plugin starts
// generateLocalPaintStylesDoc();
// generateLocalEffectStylesDoc();
// generateLocalTextStylesDoc();
