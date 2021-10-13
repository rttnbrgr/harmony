import { generateLayerStyles } from "./generateLayerStyles";

if (figma.command === "GENERATE_LAYER_STYLES") {
  console.log("generate layer styles");

  generateLayerStyles();
  //   figma.closePlugin();
}

// Global logs
// console.log("console", console);
// console.log("figma", figma);
