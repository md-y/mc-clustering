import AdmZip from 'adm-zip';
import { Recipe } from './recipe.js';
import { tagFileSchema } from '../schemas/tag-file.js';
import { Tag } from './tag.js';

const ENCODING = 'utf-8' as const;

function getEntryData(entry: AdmZip.IZipEntry): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) =>
    entry.getDataAsync((data, err) => {
      if (data) resolve(data);
      else if (err) reject(err);
    })
  )
}

export class VersionJar {
  constructor(private readonly zip: AdmZip) {}

  async *getItemTags() {
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

  async *getRecipes() {
    const entries = this.zip.getEntries().filter((entry) => entry.entryName.startsWith('data/minecraft/recipe'));
    for (const entry of entries) {
      const buffer = await getEntryData(entry);
      const recipe = new Recipe(buffer.toString(ENCODING));
      yield recipe;
    }
  }
}
