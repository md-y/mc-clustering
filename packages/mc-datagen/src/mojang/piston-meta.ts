import { PackageManifest, packageManifestSchema } from '../schemas/package-manifest.js';
import { VersionManifest, versionManifestSchema } from '../schemas/version-manifest.js';

const PISTON_META_URL = process.env.PISTON_META_URL ?? 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';

let cachedVersionManifest: VersionManifest | null = null;
const packageManifestCache: Map<string, PackageManifest> = new Map();

export async function getVersionManifest(): Promise<VersionManifest> {
  if (cachedVersionManifest) return cachedVersionManifest;
  const res = await fetch(PISTON_META_URL);
  const json = await res.json();
  cachedVersionManifest = await versionManifestSchema.parseAsync(json);
  return cachedVersionManifest;
}

export async function getPackageManifest(packageId: string): Promise<PackageManifest> {
  const cachedManifest = packageManifestCache.get(packageId);
  if (cachedManifest) return cachedManifest;

  const versionManifest = await getVersionManifest();
  const version = versionManifest.versions.find((ver) => ver.id === packageId);
  if (!version) throw new Error(`Could not find package: ${packageId}`);

  const res = await fetch(version.url);
  const json = await res.json();
  const manifest = await packageManifestSchema.parseAsync(json);
  packageManifestCache.set(packageId, manifest);
  return manifest;
}
