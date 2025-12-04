import { Item } from '../mojang/item';

type Edge = {
  target: Item;
  weights: number[];
};

export class AdjacencyMatrix {
  private cachedMatrix: null | Map<Item, Edge[]> = null;

  constructor(private readonly items: Item[]) {}

  toCSV() {
    const matrix = this.createAdjacencyMatrix();
    const rows: string[] = [];
    for (const [item1, edges] of matrix) {
      for (const edge of edges) {
        if (edge.weights.reduce((acc, v) => acc + v, 0) === 0) continue;
        rows.push(`${item1.id}, ${edge.target.id}, ${edge.weights.join(', ')}`);
      }
    }
    return rows.join('\n');
  }

  private createAdjacencyMatrix() {
    if (this.cachedMatrix) return this.cachedMatrix;

    const matrix = new Map<Item, Edge[]>();
    for (const item1 of this.items.values()) {
      const row = new Set<Edge>();
      for (const item2 of this.items.values()) {
        if (item1 == item2) continue;
        const weights = this.getWeight(item1, item2);
        row.add({ target: item2, weights });
      }
      matrix.set(item1, Array.from(row));
    }
    this.cachedMatrix = matrix;
    return matrix;
  }

  private getWeight(item1: Item, item2: Item) {
    const setGroups = [item1, item2].map((item) => {
      const nameParts = item.id.replaceAll('minecraft:', '').split('_');
      const nameSet = new Set(nameParts);
      return [nameSet, item.recipes, item.tags];
    });

    const weights: number[] = [];
    for (let i = 0; i < Infinity; i++) {
      const sets: Set<unknown>[] = []
      for (const group of setGroups) {
        const set = group[i];
        if (set) sets.push(set);
      }
      const [first, ...others] = sets;
      if (!first || others.length === 0) break;
      let intersection: Set<unknown> = first;
      for (const set of others) {
        intersection = intersection.intersection(set);
      }
      weights.push(intersection.size);
    }

    return weights;
  }
}
