/**
 * This was model from nestjs schematics
 * https://github.com/nestjs/schematics/blob/master/src/utils/module-import.declarator.ts
*/

import { normalize } from 'path';
import { DeclarationOptions } from './area.declarator';
import { PathSolver } from './path.solver';

export class ImportDeclarator {
  constructor(private solver: PathSolver = new PathSolver()) { }

  public declare(content: string, options: DeclarationOptions): string {
    const toInsert = this.buildLineToInsert(options);
    const contentLines = content.split('\n');
    const finalImportIndex = this.findImportsEndpoint(contentLines);
    contentLines.splice(finalImportIndex + 1, 0, toInsert);
    return contentLines.join('\n');
  }

  private findImportsEndpoint(contentLines: string[]): number {
    const reversedContent = Array.from(contentLines).reverse();
    const reverseImports = reversedContent.filter(line =>
      line.match(/\} from ('|")/),
    );
    if (reverseImports.length <= 0) {
      return 0;
    }
    return contentLines.indexOf(reverseImports[0]);
  }

  private buildLineToInsert(options: DeclarationOptions): string {
    return `import { ${options.symbol} } from '${this.computeRelativePath(
      options,
    )}';`;
  }

  private computeRelativePath(options: DeclarationOptions): string {
    let importModulePath: string;
    if (options.type !== undefined) {
      importModulePath = normalize(
        `${options.path}/${options.name}.${options.type}.ts`,
      );
    } else {
      importModulePath = normalize(`/${options.path}/${options.name}.ts`);
    }
    return this.solver.relative(options.area, importModulePath);
  }
}
