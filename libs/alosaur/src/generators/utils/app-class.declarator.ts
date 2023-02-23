/**
 * This was model from nestjs schematics
 * https://github.com/nestjs/schematics/blob/master/src/utils/module-metadata.declarator.ts
*/
import { AlosaurMetadataManager } from './alosaur.manager';
import { DeclarationOptions } from './app.declarator';

export class AppClassDeclarator {
  public declare(content: string, options: DeclarationOptions): string {
    const manager = new AlosaurMetadataManager(content);
    const inserted = manager.insert(
      options.metadata,
      options.symbol,
      options.staticOptions,
    );
    return inserted;
  }
}
