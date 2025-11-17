import { Recipe } from "./recipe.js";

export class Item {
  readonly recipes = new Set<Recipe>();

  constructor(readonly id: string) {}
}
