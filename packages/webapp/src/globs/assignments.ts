const assignmentsGlob = import.meta.glob('../../../ml/dist/**/*.json', { eager: true });

export function getAssignment(version: string, model: string, n: number | string): string[][] {
  n = `${n}`;
  for (const [path, module] of Object.entries(assignmentsGlob)) {
    const pathParts = path.replace('.json', '').split('/');
    const moduleVer = pathParts.at(-2)!;
    const [moduleModel, moduleN] = pathParts.at(-1)!.split('_');
    if (moduleVer === version && model === moduleModel && n === moduleN) {
      return (module as any).default;
    }
  }
  return [];
}

export function getNParams() {
  const ns = new Set<number>();
  for (const path of Object.keys(assignmentsGlob)) {
    const filename = path.split('/').at(-1);
    if (!filename) continue;
    const nStr = filename.replace('.json', '').split('_')[1];
    if (!nStr) continue;
    const num = parseInt(nStr);
    if (isNaN(num)) continue;
    ns.add(num);
  }
  return Array.from(ns);
}

export function getModels() {
  const models = new Set<string>();
  for (const path of Object.keys(assignmentsGlob)) {
    const filename = path.split('/').at(-1);
    if (!filename) continue;
    const model = filename.split('_')[0];
    if (!model) continue;
    models.add(model)
  }
  return Array.from(models);
}