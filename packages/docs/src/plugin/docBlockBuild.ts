import { MAIN_FRAME_KEY, DOC_BLOCK_ROOT, DOC_BLOCK_2_ROOT } from "./types";
import { storedFrameExists, getStoredFrame } from "./frameHelpers";
import {
  docBlockSwatchConfig,
  docBlockTextConfig,
  setupComponentBegin,
  setupComponentTextPieces,
  setupComponentSwatch,
} from "./docBlockSetup";

export function getComponentStyleSwatch() {
  let component;
  // check if it exists
  const componentExists = storedFrameExists(DOC_BLOCK_ROOT);
  // if it exists
  if (componentExists) {
    // console.log("👀👀👀👀 ComponentStyleSwatch already exists");
    component = getStoredFrame(DOC_BLOCK_ROOT);
    /**
     * Bug:
     * If comopnent exists but its been removed,
     * the value of removed does not return correclty.
     * This means, once the initial component is created, it will always exist and if its
     * been deleted, we can't revive it.
     *
     * To work around this we will?:
     * - Clone the existing component
     * - Update saved ids
     * - Relink components
     * - Delete old component
     *
     */
    let isRemoved = component.removed;
    // console.log("removed? ", isRemoved);
    // the remove function doesnt work, so we need to try cloning and relinking this
    // return component;

    // Lets manually remove and rebuild teh component
    // console.log("let's remove teh component?");
  }
  // boostrap it
  // console.log("🙅‍♀️🙅‍♀️🙅‍♀️ doesnt exist. gotta create it");
  component = buildComponentStyleSwatch();
}

function spoofComponentPlacement(componentRef, isSwatch = true) {
  // resize
  componentRef.resizeWithoutConstraints(componentRef.width, componentRef.height);
  // Temp fix: Get the edge of the master frame
  const mainFrame = getStoredFrame(MAIN_FRAME_KEY) as FrameNode;
  componentRef.x = isSwatch ? mainFrame.x : mainFrame.x + 200;
  componentRef.y = mainFrame.y - 200 - componentRef.height;
}

export function buildComponentStyleSwatch() {
  // console.log("😎 buildComponentStyleSwatch");

  // Build the component itself
  const sampleComponent: ComponentNode = setupComponentBegin(docBlockSwatchConfig);

  // Build the swatch
  setupComponentSwatch(sampleComponent, docBlockSwatchConfig);

  // Build the text parts
  setupComponentTextPieces(sampleComponent, docBlockSwatchConfig);

  // Hack: placement
  spoofComponentPlacement(sampleComponent);
}

export function buildComponentStyleText() {
  // console.log("👋 buildComponentStyleText");

  // Build the component itself
  const sampleComponent: ComponentNode = setupComponentBegin(docBlockTextConfig);

  // Build the text parts
  setupComponentTextPieces(sampleComponent, docBlockTextConfig);

  // Hack: placement
  spoofComponentPlacement(sampleComponent, false);
}

/**
 *
 * @param stylesArray Array of styles
 * @param frame Frame to append to
 * @param buildSample function to use to build style docs
 */
export function buildStyleFramesNew<StyleType>(
  stylesArray: Array<StyleType>,
  frame: FrameNode,
  buildSample: (styleType: StyleType) => InstanceNode
) {
  stylesArray.forEach((styleType, i) => {
    // Build each
    const styleFrameItem = buildSample(styleType);
    // Add to StyleFrame
    frame.appendChild(styleFrameItem);
  });
}
