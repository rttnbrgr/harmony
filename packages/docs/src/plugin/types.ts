export const MAIN_FRAME_KEY = "MainFrame";
export const TEXT_STYLES_FRAME = "TextStylesFrame";

export type FigmaDocsFrame = "ColorStylesFrame" | "TextStylesFrame" | "EffectStylesFrame" | "MainFrame";

// Refactor as enums
export enum DocsFrames {
  ColorStyles = "ColorStylesFrame",
  TextStyles = "TextStylesFrame",
  EffectStyles = "EffectStylesFrame",
  Main = "MainFrame",
}

// For the swatch doc block
export const DOC_BLOCK_ROOT: DocBlockRootNodes = "DocBlockComponent";
export const DOC_BLOCK_SWATCH: DocBlockNodes = "DocBlockSwatch";
export const DOC_BLOCK_TITLE: DocBlockNodes = "DocBlockTitle";
export const DOC_BLOCK_SPEC: DocBlockNodes = "DocBlockSpec";

// For the text doc block
export const DOC_BLOCK_2_ROOT: DocBlockRootNodes = "DocBlockComponent2";
export const DOC_BLOCK_2_TITLE: DocBlockNodes = "DocBlockTitle2";
export const DOC_BLOCK_2_SPEC: DocBlockNodes = "DocBlockSpec2";

export type DocBlockRootNodes = "DocBlockComponent" | "DocBlockComponent2";

export type DocBlockNodes =
  | DocBlockRootNodes
  | "DocBlockSwatch"
  | "DocBlockTitle"
  | "DocBlockSpec"
  | "DocBlockTitle2"
  | "DocBlockSpec2";

export type ShadowEffectType = "DROP_SHADOW" | "INNER_SHADOW";
export type BlurEffectType = "LAYER_BLUR" | "BACKGROUND_BLUR";
export type EffectType = ShadowEffectType | BlurEffectType;
