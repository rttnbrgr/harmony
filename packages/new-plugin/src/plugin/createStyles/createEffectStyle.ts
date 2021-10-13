export function createEffectStyle(element) {
  // check if effect style exists
  if (element.effectStyleId) {
    console.log("effectStyle exists", element.effectStyleId);
  } else if (element.effects?.length > 0) {
    console.log("element.effects", element.effects);
    // create effect style
    const effectStyle = figma.createEffectStyle();
    effectStyle.name = element.name;
    (effectStyle as any).effects = element.effects;

    element.effectStyleId = effectStyle.id;
  }
}
