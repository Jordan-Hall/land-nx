import {
  formatFiles,
  generateFiles,
  names,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedOptions, AlosaurWithAreaeOption } from '../utils/types';
import { normalizeOptions } from '../utils/normalize-options';
import { AreaDeclarator, DeclarationOptions } from '../utils/area.declarator';

function addFiles(tree: Tree, options: NormalizedOptions) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    template: ''
  };
  generateFiles(tree, path.join(__dirname, 'files', 'src'), options.path, templateOptions);
}

function addDeclarationToArea(tree: Tree, options: NormalizedOptions) {

  if (options.skipImport !== undefined && options.skipImport) {
    return tree;
  }

  if (!options.area) {
    return tree;
  }
  const content = tree.read(options.area).toString();
  const declarator: AreaDeclarator = new AreaDeclarator();
  tree.write(
    options.area,
    declarator.declare(content, { ...options, metadata: 'areas', type: 'controller' } as DeclarationOptions),
  );
  return tree;
}

function areaNormalizeOptions(tree: Tree, options: AlosaurWithAreaeOption) {
  const normalizedOptions = normalizeOptions(tree, options);
  normalizedOptions.area = options.area ? `${normalizedOptions.sourceRoot}/${options.area}` : undefined;
  return normalizedOptions;
}

export default async function (tree: Tree, options: AlosaurWithAreaeOption) {
  const normalizedOptions = areaNormalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);

  if (normalizedOptions.area) {
    addDeclarationToArea(tree, normalizedOptions)
  }

  if (options.skipFormat !== undefined && !options.skipFormat) {
    await formatFiles(tree);
  }
}
