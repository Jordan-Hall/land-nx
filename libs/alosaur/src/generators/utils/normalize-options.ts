/**
 * Credit to Nrwl for @nrwl/nest,
 */

import type { Tree } from '@nrwl/devkit';
import { names, readProjectConfiguration } from '@nrwl/devkit';
import type {
  AlosaurGeneratorOptions,
  NormalizedOptions,
} from './types';

export function normalizeOptions(
  tree: Tree,
  options: AlosaurGeneratorOptions
): NormalizedOptions {
  const { sourceRoot } = readProjectConfiguration(tree, options.project);

  const normalizedOptions: NormalizedOptions = {
    ...options,
    flat: options.flat,
    name: names(options.name).fileName,
    path: options.directory ? `${sourceRoot}/${options.directory}` : sourceRoot,
    skipFormat: options.skipFormat,
    sourceRoot,
  };

  return normalizedOptions;
}

