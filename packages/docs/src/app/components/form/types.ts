export type Actions = "CREATE_COLOR_STYLES" | "CREATE_EFFECT_STYLES" | "CREATE_TEXT_STYLES";

export type ReducerState = { [key in Actions]: boolean };
