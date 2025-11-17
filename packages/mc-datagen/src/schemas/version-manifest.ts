import { object, string, array, number } from 'zod';
import type z from 'zod';

export const versionManifestSchema = object({
  latest: object({
    release: string(),
    snapshot: string(),
  }),
  versions: array(
    object({
      id: string(),
      type: string(),
      url: string(),
      time: string(),
      releaseTime: string(),
      sha1: string(),
      complianceLevel: number(),
    })
  ),
});

export type VersionManifest = z.infer<typeof versionManifestSchema>;
