import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import * as path from 'path';
import { ApplicationGeneratorSchema } from './schema';
import denoBaseGenerator from '@nrwl/deno/src/generators/application/generator';
import { ALOSAUR_VERSION } from '../utils/version';

interface NormalizedSchema extends ApplicationGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: ApplicationGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
    const templateOptions = {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: ''
    };
    generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

function addAlosaurToImportPath(tree: Tree) {
  updateJson(tree, 'import_map.json', (json) => {
    const importPath = 'alosaur/'
    json.imports = json.imports || {};
    if (!json.imports[importPath]) {
      json.imports[importPath] = `https://deno.land/x/alosaur@${ALOSAUR_VERSION}/`
    }
    return json;
  });
}


export default async function (tree: Tree, options: ApplicationGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  denoBaseGenerator(tree, options);
  tree.delete(`${normalizedOptions.projectRoot}/src/handler.ts`);
  tree.delete(`${normalizedOptions.projectRoot}/src/handler.test.ts`);
  tree.delete(`${normalizedOptions.projectRoot}/src/main.ts`);
  addFiles(tree, normalizedOptions);
  addAlosaurToImportPath(tree);
  await formatFiles(tree);
}
