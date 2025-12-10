import { Tag } from '../mojang/tag';
import { Item, ItemFeature } from '../mojang/item';
import { Recipe } from '../mojang/recipe';

type Sample = {
  item: Item;
  features: number[];
};

type CachedFeatureData = {
  samples: Sample[];
  features: ItemFeature[];
};

export class FeatureData {
  private cachedData: null | CachedFeatureData = null;

  constructor(private readonly items: Item[]) {}

  toCSV() {
    const { samples, features } = this.createFeatureData();
    const rows = [this.getCSVHeader(features)];
    for (const sample of samples) {
      const featureCols = sample.features.join(',');
      rows.push(`${sample.item.id},${featureCols}`);
    }
    return rows.join('\n');
  }

  private createFeatureData() {
    if (this.cachedData) return this.cachedData;

    let featureSet = new Set<ItemFeature>();

    for (const item of this.items) {
      featureSet = featureSet.union(item.features);
    }

    const features = Array.from(featureSet);

    const samples: Sample[] = [];
    for (const item of this.items) {
      const itemFeatures = item.features;
      samples.push({
        item,
        features: features.map((f) => (itemFeatures.has(f) ? 1 : 0)),
      });
    }

    this.cachedData = {
      samples,
      features,
    };
    return this.cachedData;
  }

  private getCSVHeader(features: ItemFeature[]) {
    const header = ['Item'];
    let recipeCounter = 0;
    for (const feature of features) {
      if (feature instanceof Tag) {
        header.push(`tag:${feature.id}`);
      } else if (feature instanceof Recipe) {
        header.push(`recipe:${recipeCounter++}`);
      } else {
        header.push(`name:${feature}`);
      }
    }
    return header.join(',');
  }
}
