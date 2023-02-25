/**
 * This was model from nestjs schematics
 * https://github.com/nestjs/schematics/blob/master/src/utils/module.declarator.ts
*/
import { names } from '@nrwl/devkit';
import { ImportDeclarator } from './import.declarator';
import { AreaMetadataDeclarator } from './area-metadata.declarator';

export interface DeclarationOptions {
  metadata: string;
  declarationName: string;
  type?: string;
  name: string;
  className?: string;
  path: string;
  area: string;
  symbol?: string;
  staticOptions?: {
    name: string;
    value: Record<string, unknown>;
  };
}

export class AreaDeclarator {
  constructor(
    private imports: ImportDeclarator = new ImportDeclarator(),
    private metadata: AreaMetadataDeclarator = new AreaMetadataDeclarator(),
  ) { }

  public declare(content: string, options: DeclarationOptions): string {
    options = this.computeSymbol(options);
    content = this.imports.declare(content, options);
    content = this.metadata.declare(content, options);
    return content;
  }

  private computeSymbol(options: DeclarationOptions): DeclarationOptions {
    const name = names(options.name);
    const type = names(options.type);
    const target = Object.assign({}, options);
    if (options.className) {
      target.symbol = options.className;
    } else if (options.type !== undefined) {
      target.symbol = name.className.concat(type.className);
    } else {
      target.symbol = name.className;
    }
    return target;
  }
}
