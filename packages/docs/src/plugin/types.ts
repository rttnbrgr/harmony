export const MAIN_FRAME_KEY = "MainFrame";

export type FigmaDocsFrame = "ColorStylesFrame" | "TextStylesFrame" | "EffectStylesFrame" | "MainFrame";

// Refactor as enums
export enum DocsFrames {
  ColorStyles = "ColorStylesFrame",
  TextStyles = "TextStylesFrame",
  EffectStyles = "EffectStylesFrame",
  Main = "MainFrame",
}

// For the swatch doc block
export const DOC_BLOCK_ROOT: DocBlockNodes = "DocBlockComponent";
export const DOC_BLOCK_SWATCH: DocBlockNodes = "DocBlockSwatch";
export const DOC_BLOCK_TITLE: DocBlockNodes = "DocBlockTitle";
export const DOC_BLOCK_SPEC: DocBlockNodes = "DocBlockSpec";

// For the text doc block
export const DOC_BLOCK_2_ROOT: DocBlockNodes = "DocBlockComponent2";
export const DOC_BLOCK_2_TITLE: DocBlockNodes = "DocBlockTitle2";
export const DOC_BLOCK_2_SPEC: DocBlockNodes = "DocBlockSpec2";

export type DocBlockNodes =
  | "DocBlockComponent"
  | "DocBlockSwatch"
  | "DocBlockTitle"
  | "DocBlockSpec"
  | "DocBlockComponent2"
  | "DocBlockTitle2"
  | "DocBlockSpec2";

export type ShadowEffectType = "DROP_SHADOW" | "INNER_SHADOW";
export type BlurEffectType = "LAYER_BLUR" | "BACKGROUND_BLUR";
export type EffectType = ShadowEffectType | BlurEffectType;
