/**
 * Splits a serialized CraftJS JSON into two parts:
 * - `beforePlans`: all top-level sections except the last one (FAQ)
 * - `afterPlans`: only the last top-level section (FAQ)
 *
 * CraftJS renders only what is listed in ROOT.nodes,
 * so unreferenced nodes in the JSON are safely ignored.
 */
export function splitNoCodeContent(content: string): { beforePlans: string; afterPlans: string } {
    const json = JSON.parse(content);
    const rootNodes: string[] = json.ROOT?.nodes ?? [];

    return {
        beforePlans: JSON.stringify({ ...json, ROOT: { ...json.ROOT, nodes: rootNodes.slice(0, -1) } }),
        afterPlans:  JSON.stringify({ ...json, ROOT: { ...json.ROOT, nodes: rootNodes.slice(-1) } }),
    };
}
