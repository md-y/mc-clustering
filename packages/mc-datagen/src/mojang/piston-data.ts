import { PackageManifest } from '../schemas/package-manifest.js';
import { getPackageManifest } from './piston-meta.js';
import { VersionJar } from './version-jar.js';
import { resolve } from 'node:path';
import { file } from 'bun';

type DownloadType = keyof PackageManifest['downloads'];

const cacheDir = process.env.CACHE_DIR ?? resolve(import.meta.dir, '.cache');
const versionJarCache = new Map<string, VersionJar>();

export async function downloadVersionJar(versionId: string, downloadType: DownloadType): Promise<VersionJar> {
  const manifest = await getPackageManifest(versionId);
  const url = manifest.downloads[downloadType]?.url;
  const sha = manifest.downloads[downloadType]?.sha1;
  if (!url || !sha) throw new Error(`Could not find download "${downloadType}" for version ${versionId}`);

  const cachedJar = await getVersionJarFromCache(sha);
  if (cachedJar) return cachedJar;

  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const versionJar = new VersionJar(arrayBuffer);
  await addVersionJarToCache(sha, versionJar);
  return versionJar;
}

export async function getVersionJarFromCache(sha: string): Promise<VersionJar | null> {
  const memoryJar = versionJarCache.get(sha);
  if (memoryJar) return memoryJar;

  const path = resolve(cacheDir, `${sha}.jar`);
  const cachedFile = file(path);
  if (!(await cachedFile.exists())) return null;

  const arrayBuffer = await cachedFile.arrayBuffer();
  const newJar = new VersionJar(arrayBuffer);
  versionJarCache.set(sha, newJar);
  return newJar;
}

export async function addVersionJarToCache(sha: string, jar: VersionJar) {
  versionJarCache.set(sha, jar);
  const jarFile = file(resolve(cacheDir, `${sha}.jar`));
  await jarFile.write(jar.arrayBuffer);
}
