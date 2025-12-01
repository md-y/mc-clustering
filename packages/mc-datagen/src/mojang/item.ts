import { Recipe } from "./recipe.js";
import { Tag } from './tag.js';

export class Item {
  readonly recipes = new Set<Recipe>();
  readonly tags = new Set<Tag>();

  constructor(readonly id: string) {}
}
