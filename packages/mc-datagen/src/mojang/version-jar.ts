import AdmZip from 'adm-zip';
import { Recipe } from './recipe.js';
import { tagFileSchema } from '../schemas/tag-file.js';
import { Tag } from './tag.js';
import { Item } from './item.js';
import { AdjacencyMatrix } from '../ml/adjacency-matrix.js';
import { FeatureData } from '../ml/feature-data.js';
import { resolve } from 'path';
import Bun from 'bun';

const ENCODING = 'utf-8' as const;

function getEntryData(entry: AdmZip.IZipEntry): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) =>
    entry.getDataAsync((data, err) => {
      if (data) resolve(data);
      else if (err) reject(err);
    })
  );
}

export class VersionJar {
  private zip: AdmZip;

  public readonly items = new Map<string, Item>();
  public readonly tags = new Map<string, Tag>();
  public readonly recipes: Recipe[] = [];

  constructor(public readonly arrayBuffer: ArrayBuffer) {
    this.zip = new AdmZip(Buffer.from(arrayBuffer));
  }

  async analyze() {
    // Base items
    for (const item of this.getItems()) {
      this.items.set(item.id, item);
    }

    // Tags
    for await (const tag of this.getItemTags()) {
      this.tags.set(tag.id, tag);
      for (const itemId of tag.itemIds) {
        const item = this.items.get(itemId);
        if (!item) throw new Error(`Found unknown item when parsing tag: ${itemId}`);
        item.tags.add(tag);
      }
    }
    for (const parentTag of this.tags.values()) {
      for (const childTagId of parentTag.tagIds) {
        const childTag = this.tags.get(childTagId);
        if (!childTag) throw new Error(`Unknown tag inside of another tag: ${childTagId} in ${parentTag.id}`);
        for (const itemId of childTag.itemIds) {
          this.items.get(itemId)?.tags.add(parentTag);
        }
      }
    }

    // Recipes
    for await (const recipe of this.getRecipes()) {
      this.recipes.push(recipe);
      const recipeItems = recipe.getAllInputs();
      for (const inputId of recipeItems) {
        let inputItems: Item[] = [];
        if (inputId.startsWith('#')) {
          const tag = this.tags.get(inputId);
          if (!tag) throw new Error(`Unknown tag: ${inputId}`);
          inputItems = tag.itemIds.map((itemId) => this.items.get(itemId)).filter((item): item is Item => !!item);
        } else {
          const item = this.items.get(inputId);
          if (!item) continue;
          inputItems = [item];
        }
        for (const item of inputItems) {
          item.recipes.add(recipe);
        }
      }
    }
  }

  async writeAllTextures(path: string) {
    const images = await Array.fromAsync(this.getTextures());
    await Promise.all(
      images.map(async (img) => {
        await Bun.write(resolve(path, img.filename), img.data);
      })
    );
  }

  public createAdjacencyMatrix(): AdjacencyMatrix {
    return new AdjacencyMatrix(Array.from(this.items.values()));
  }

  public createFeatureData(): FeatureData {
    return new FeatureData(Array.from(this.items.values()));
  }

  private *getItems() {
    const pathPrefix = 'assets/minecraft/items/';
    const entries = this.zip.getEntries().filter((entry) => entry.entryName.startsWith(pathPrefix));
    for (const entry of entries) {
      const fileName = entry.entryName.slice(pathPrefix.length).replaceAll('.json', '');
      const id = `minecraft:${fileName}`;
      const item = new Item(id);
      yield item;
    }
  }

  private async *getItemTags() {
    const pathPrefix = 'data/minecraft/tags/item/';
    const entries = this.zip.getEntries().filter((entry) => entry.entryName.startsWith(pathPrefix));
    for (const entry of entries) {
      const fileName = entry.entryName.slice(pathPrefix.length).replaceAll('.json', '');
      const id = `#minecraft:${fileName}`;

      const buffer = await getEntryData(entry);
      const json = JSON.parse(buffer.toString(ENCODING));
      const tagFile = await tagFileSchema.parseAsync(json);
      const tag = new Tag(id, tagFile.values);
      yield tag;
    }
  }

  private async *getRecipes() {
    const entries = this.zip.getEntries().filter((entry) => entry.entryName.startsWith('data/minecraft/recipe'));
    for (const entry of entries) {
      const buffer = await getEntryData(entry);
      const recipe = new Recipe(buffer.toString(ENCODING));
      yield recipe;
    }
  }

  private async *getTextures() {
    const entries = this.zip.getEntries().filter((entry) => entry.entryName.startsWith('assets/minecraft/textures/block') || entry.entryName.startsWith('assets/minecraft/textures/item'));
    for (const entry of entries) {
      const buffer = await getEntryData(entry);
      yield {
        data: new Blob([buffer], { type: 'image/png' }),
        filename: entry.name,
      };
    }
  }
}
