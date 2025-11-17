import AdmZip from 'adm-zip';
import { PackageManifest } from '../schemas/package-manifest.js';
import { getPackageManifest } from './piston-meta.js';
import { VersionJar } from './version-jar.js';

type DownloadType = keyof PackageManifest['downloads'];

export async function downloadVersionJar(versionId: string, downloadType: DownloadType): Promise<VersionJar> {
  const manifest = await getPackageManifest(versionId);
  const url = manifest.downloads[downloadType]?.url;
  if (!url) throw new Error(`Could not find download "${downloadType}" for version ${versionId}`);

  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return new VersionJar(new AdmZip(Buffer.from(arrayBuffer)));
}

