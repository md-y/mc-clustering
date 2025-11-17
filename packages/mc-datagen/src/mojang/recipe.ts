import { RecipeFile, recipeFileSchema } from '../schemas/recipe-file.js';

export class Recipe {
  private file: RecipeFile;

  constructor(recipe: string | RecipeFile) {
    if (typeof recipe === 'string') {
      recipe = recipeFileSchema.parse(JSON.parse(recipe));
    }
    this.file = recipe;
  }

  get type() {
    return this.file.type;
  }

  get category() {
    return this.file.category ?? 'misc';
  }

  get group() {
    return this.file.group;
  }

  getAllInputs(): string[] {
    const rawInputs = [
      this.file.addition,
      this.file.base,
      this.file.template,
      this.file.ingredient,
      this.file.ingredients,
      this.file.input,
      this.file.material,
      Object.values(this.file.key ?? {}),
    ];

    // The pattern is either the encoded recipe, or just an item
    if (typeof this.file.pattern === 'string' && this.file.pattern.includes('minecraft:')) {
      rawInputs.push(this.file.pattern);
    }

    return rawInputs.flat(2).filter((input) => !!input) as string[];
  }
}
