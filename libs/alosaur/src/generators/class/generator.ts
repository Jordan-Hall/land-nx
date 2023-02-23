import {
  formatFiles,
  generateFiles,
  names,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedOptions, AlosaurGeneratorOptions } from '../utils/types';
import { normalizeOptions } from '../utils/normalize-options';



function addFiles(tree: Tree, options: NormalizedOptions) {
    const templateOptions = {
      ...options,
      ...names(options.name),
      template: ''
    };
    generateFiles(tree, path.join(__dirname, 'files', 'src'), options.path, templateOptions);
}

export default async function (tree: Tree, options: AlosaurGeneratorOptions) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
