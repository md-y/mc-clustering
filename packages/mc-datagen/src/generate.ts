import { resolve } from 'path';
import { versions } from './config';
import { downloadVersionJar } from './mojang/piston-data';

const distDir = resolve(import.meta.dir, '../dist');

async function generateVersion(ver: string) {
  const jar = await downloadVersionJar(ver, 'client');
  await jar.analyze();

  const ouputDir = resolve(distDir, ver);

  const matrix = jar.createAdjacencyMatrix().toCSV();
  const features = jar.createFeatureData().toCSV();

  await Promise.all([
    jar.writeAllTextures(resolve(ouputDir, 'textures')),
    Bun.write(resolve(ouputDir, 'matrix.csv'), matrix),
    Bun.write(resolve(ouputDir, 'features.csv'), features),
  ]);
}

versions.forEach((ver) => generateVersion(ver));
