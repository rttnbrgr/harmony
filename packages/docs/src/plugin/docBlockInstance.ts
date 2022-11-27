import { FigmaDocsFrame, DocBlockNodes } from "./types";

function getInstanceNode(
  masterComponent: ComponentNode,
  instanceComponent: InstanceNode,
  searchId: FigmaDocsFrame | DocBlockNodes,
  deepFind: boolean = true
) {
  // Lookup the ID
  const pluginDataId = masterComponent.getPluginData(searchId);
  // Find the node on the instance
  let node;
  if (deepFind) {
    node = instanceComponent.findOne((node) => node.id.endsWith(pluginDataId));
  } else {
    node = instanceComponent.findChild((node) => node.id.endsWith(pluginDataId));
  }

  return node;
}
