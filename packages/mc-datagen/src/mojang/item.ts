import { Recipe } from "./recipe.js";
import { Tag } from './tag.js';

export type ItemFeature = Tag | string | Recipe;

export class Item {
  readonly recipes = new Set<Recipe>();
  readonly tags = new Set<Tag>();
  readonly nameParts: Set<string>;

  constructor(readonly id: string) {
    this.nameParts = new Set(id.replaceAll('minecraft:', '').split('_'));
  }

  get features() {
    return this.recipes.union(this.tags).union(this.nameParts);
  }
}
