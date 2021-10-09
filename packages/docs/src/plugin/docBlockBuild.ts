import { MAIN_FRAME_KEY, DOC_BLOCK_ROOT, DOC_BLOCK_2_ROOT, DocBlockNodes, DocBlockRootNodes } from "./types";
import { storedFrameExists, getStoredFrame, getStoredNode } from "./frameHelpers";
import {
  docBlockSwatchConfig,
  docBlockTextConfig,
  setupComponentBegin,
  setupComponentTextPieces,
  setupComponentSwatch,
} from "./docBlockSetup";

// check if the component exists
// if it does, return it
// if not, return the component or do nothing
export function ensureComponentExists(nodeId: DocBlockRootNodes, foo: string = "put a string here"): ComponentNode {
  /**
   * Check if the component exists;
   */
  let docBlockComponent = getStoredNode(nodeId) as ComponentNode;
  let docBlockExists = !!docBlockComponent;
  console.log(foo, docBlockComponent);

  // If so, return it
  if (docBlockExists) {
    console.log("returning here");
    return docBlockComponent;

    // if it exists, but its been removed
    // console.log("👀👀👀👀 ComponentStyleSwatch already exists");
    // component = getStoredFrame(nodeId);
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
    // let isRemoved = component.removed;
    // console.log("removed? ", isRemoved);
    // the remove function doesnt work, so we need to try cloning and relinking this
    // return component;

    // Lets manually remove and rebuild teh component
    // console.log("let's remove teh component?");
  }

  console.log("made it past");

  // Otherwise, boostrap it
  const isSwatchComponent = nodeId === DOC_BLOCK_ROOT;
  // console.log("🙅‍♀️🙅‍♀️🙅‍♀️ doesnt exist. gotta create it");
  docBlockComponent = isSwatchComponent ? buildComponentStyleSwatch() : buildComponentStyleText();
  return docBlockComponent;
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

  return sampleComponent;
}

export function buildComponentStyleText() {
  // console.log("👋 buildComponentStyleText");

  // Build the component itself
  const sampleComponent: ComponentNode = setupComponentBegin(docBlockTextConfig);

  // Build the text parts
  setupComponentTextPieces(sampleComponent, docBlockTextConfig);

  // Hack: placement
  spoofComponentPlacement(sampleComponent, false);

  return sampleComponent;
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
