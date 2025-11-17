import { object, string, array, number, union, literal, optional, record, boolean } from 'zod';
import type z from 'zod';

const ruleSchema = object({
  action: literal('allow'),
  os: optional(
    object({
      name: optional(union([literal('osx'), literal('windows'), literal('linux')])),
      arch: optional(union([literal('x86'), literal('x86_64'), literal('aarch_64')])),
    })
  ),
  features: optional(record(string(), boolean())),
});

const conditionalValueSchema = union([
  string(),
  array(string()),
  object({
    rules: array(ruleSchema),
    value: union([string(), array(string())]),
  }),
]);

const argumentsSchema = object({
  game: array(conditionalValueSchema),
  jvm: array(conditionalValueSchema),
});

const assetIndexSchema = object({
  id: string(),
  sha1: string(),
  size: number(),
  totalSize: number(),
  url: string(),
});

const downloadItemSchema = object({
  sha1: string(),
  size: number(),
  url: string(),
});

const downloadsSchema = object({
  client: downloadItemSchema,
  client_mappings: optional(downloadItemSchema),
  server: optional(downloadItemSchema),
  server_mappings: optional(downloadItemSchema),
});

const javaVersionSchema = object({
  component: string(),
  majorVersion: number(),
});

const libraryArtifactSchema = object({
  path: string(),
  sha1: string(),
  size: number(),
  url: string(),
});

const libraryDownloadsSchema = object({
  artifact: libraryArtifactSchema,
});

const librarySchema = object({
  downloads: libraryDownloadsSchema,
  name: string(),
  rules: optional(array(ruleSchema)),
});

const loggingFileSchema = object({
  id: string(),
  sha1: string(),
  size: number(),
  url: string(),
});

const loggingClientSchema = object({
  argument: string(),
  file: loggingFileSchema,
  type: string(),
});

const loggingSchema = object({
  client: loggingClientSchema,
});

export const packageManifestSchema = object({
  arguments: argumentsSchema,
  assetIndex: assetIndexSchema,
  assets: string(),
  complianceLevel: number(),
  downloads: downloadsSchema,
  id: string(),
  javaVersion: javaVersionSchema,
  libraries: array(librarySchema),
  logging: loggingSchema,
  mainClass: string(),
  minimumLauncherVersion: number(),
  releaseTime: string(),
  time: string(),
  type: string(),
});

export type PackageManifest = z.infer<typeof packageManifestSchema>;
