import z, { object, string, array, number, enum as zodEnum, optional, union, record } from 'zod';

// Based on https://minecraft.wiki/w/Recipe#Java_Edition_JSON_format

const recipeType = zodEnum([
  'minecraft:blasting',
  'minecraft:campfire_cooking',
  'minecraft:crafting_shaped',
  'minecraft:crafting_shapeless',
  'minecraft:crafting_transmute',
  'minecraft:crafting_decorated_pot',
  'minecraft:smelting',
  'minecraft:smithing_transform',
  'minecraft:smithing_trim',
  'minecraft:smoking',
  'minecraft:stonecutting',

  // Special recipes:
  'minecraft:crafting_special_armordye',
  'minecraft:crafting_special_bannerduplicate',
  'minecraft:crafting_special_bookcloning',
  'minecraft:crafting_special_firework_rocket',
  'minecraft:crafting_special_firework_star',
  'minecraft:crafting_special_firework_star_fade',
  'minecraft:crafting_special_mapcloning',
  'minecraft:crafting_special_mapextending',
  'minecraft:crafting_special_repairitem',
  'minecraft:crafting_special_shielddecoration',
  'minecraft:crafting_special_tippedarrow',
]);

const categories = zodEnum(['blocks', 'food', 'equipment', 'building', 'redstone', 'misc']);

const itemIdentifier = union([string(), array(string())]);

export const recipeFileSchema = object({
  type: recipeType,
  category: optional(categories),
  group: optional(string()),
  ingredient: optional(itemIdentifier),
  ingredients: optional(array(itemIdentifier)),
  key: optional(record(string(), itemIdentifier)),
  pattern: optional(union([itemIdentifier, array(string())])),
  input: optional(string()),
  material: optional(string()),
  template: optional(string()),
  base: optional(string()),
  addition: optional(string()),
  result: optional(object({
    id: string(),
    count: optional(number()),
  })),
});

export type RecipeFile = z.infer<typeof recipeFileSchema>;
