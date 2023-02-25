/**
 * This was model from nestjs schematics
 * https://github.com/nestjs/schematics/blob/master/src/utils/module-metadata.declarator.ts
*/
import { MetadataManager } from './metadata.manager';
import { DeclarationOptions } from './area.declarator';

export class AreaMetadataDeclarator {
  public declare(content: string, options: DeclarationOptions): string {
    const manager = new MetadataManager(content);
    const inserted = manager.insert(
      options.metadata,
      options.symbol,
      options.declarationName,
      options.staticOptions,
    );
    return inserted;
  }
}
