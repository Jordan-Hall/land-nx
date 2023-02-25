/**
 * This was model from nestjs schematics
 * https://github.com/nestjs/schematics/blob/master/src/utils/metadata.manager.ts
*/

import {
  forEachChild,
  ArrayLiteralExpression,
  CallExpression,
  createSourceFile,
  Decorator,
  Expression,
  Identifier,
  Node,
  NodeArray,
  ObjectLiteralElement,
  ObjectLiteralExpression,
  PropertyAssignment,
  ScriptTarget,
  SourceFile,
  StringLiteral,
  SyntaxKind,
  NewExpression,
  isNewExpression,
  isIdentifier,
} from 'typescript';
import { DeclarationOptions } from './area.declarator';

export class AlosaurMetadataManager {
  constructor(private content: string) { }

  public insert(
    metadata: string,
    symbol: string,
    staticOptions?: DeclarationOptions['staticOptions'],
  ): string {
    const source: SourceFile = createSourceFile(
      'filename.ts',
      this.content,
      ScriptTarget.ES2017,
    );
    const appExpression = this.findNewAppExpression(source);
    const node: Node = appExpression.arguments[0];
    const matchingProperties: ObjectLiteralElement[] = (
      node as ObjectLiteralExpression
    ).properties
      .filter((prop) => prop.kind === SyntaxKind.PropertyAssignment)
      .filter((prop: PropertyAssignment) => {
        const name = prop.name;
        switch (name.kind) {
          case SyntaxKind.Identifier:
            return (name as Identifier).getText(source) === metadata;
          case SyntaxKind.StringLiteral:
            return (name as StringLiteral).text === metadata;
          default:
            return false;
        }
      });

    symbol = this.mergeSymbolAndExpr(symbol, staticOptions);
    const addBlankLinesIfDynamic = () => {
      symbol = staticOptions ? this.addBlankLines(symbol) : symbol;
    };
    if (matchingProperties.length === 0) {
      const expr = node as ObjectLiteralExpression;
      if (expr.properties.length === 0) {
        addBlankLinesIfDynamic();
        return this.insertClassToEmptyAppAreaDecorator(
          expr,
          metadata,
          symbol,
        );
      } else {
        addBlankLinesIfDynamic();
        return this.insertNewClassToApp(
          expr,
          source,
          metadata,
          symbol,
        );
      }
    } else {
      return this.insertSymbolToMetadata(
        source,
        matchingProperties,
        symbol,
        staticOptions,
      );
    }
  }


  findNewAppExpression(node: Node): NewExpression | undefined {
    if (isNewExpression(node) && isIdentifier(node.expression) && node.expression.text === 'App') {
      return node;
    }

    let result: NewExpression | undefined;
    forEachChild(node, (child) => {
      result ||= this.findNewAppExpression(child);
    });
    return result;
  }

  private insertClassToEmptyAppAreaDecorator(
    expr: ObjectLiteralExpression,
    metadata: string,
    symbol: string,
  ): string {
    const position = expr.getEnd() - 1;
    const toInsert = `  ${metadata}: [${symbol}]`;
    return this.content.split('').reduce((content, char, index) => {
      if (index === position) {
        return `${content}\n${toInsert}\n${char}`;
      } else {
        return `${content}${char}`;
      }
    }, '');
  }

  private insertNewClassToApp(
    expr: ObjectLiteralExpression,
    source: SourceFile,
    metadata: string,
    symbol: string,
  ): string {
    const node = expr.properties[expr.properties.length - 1];
    const position = node.getEnd();
    const text = node.getFullText(source);
    const matches = text.match(/^\r?\n\s*/);
    let toInsert: string;
    if (matches) {
      toInsert = `,${matches[0]}${metadata}: [${symbol}]`;
    } else {
      toInsert = `, ${metadata}: [${symbol}]`;
    }
    return this.content.split('').reduce((content, char, index) => {
      if (index === position) {
        return `${content}${toInsert}${char}`;
      } else {
        return `${content}${char}`;
      }
    }, '');
  }

  private insertSymbolToMetadata(
    source: SourceFile,
    matchingProperties: ObjectLiteralElement[],
    symbol: string,
    staticOptions?: DeclarationOptions['staticOptions'],
  ): string {
    const assignment = matchingProperties[0] as PropertyAssignment;
    let node: Node | NodeArray<Expression>;
    const arrLiteral = assignment.initializer as ArrayLiteralExpression;
    if (!arrLiteral.elements) {
      // "imports" is not an array but rather function/constant
      return this.content;
    }
    if (arrLiteral.elements.length === 0) {
      node = arrLiteral;
    } else {
      node = arrLiteral.elements;
    }
    if (Array.isArray(node)) {
      const nodeArray = node as unknown as Node[];
      const symbolsArray = nodeArray.map((childNode) =>
        childNode.getText(source),
      );
      if (symbolsArray.includes(symbol)) {
        return this.content;
      }
      node = node[node.length - 1];
    }
    let toInsert: string;
    let position = (node as Node).getEnd();

    if ((node as Node).kind === SyntaxKind.ArrayLiteralExpression) {
      position--;
      toInsert = staticOptions ? this.addBlankLines(symbol) : `${symbol}`;
    } else {
      const text = (node as Node).getFullText(source);
      const itemSeparator = (
        text.match(/^\r?\n(\r?)\s+/) ||
        text.match(/^\r?\n/) ||
        ' '
      )[0];
      toInsert = `,${itemSeparator}${symbol}`;
    }
    return this.content.split('').reduce((content, char, index) => {
      if (index === position) {
        return `${content}${toInsert}${char}`;
      } else {
        return `${content}${char}`;
      }
    }, '');
  }

  private mergeSymbolAndExpr(
    symbol: string,
    staticOptions?: DeclarationOptions['staticOptions'],
  ): string {
    if (!staticOptions) {
      return symbol;
    }
    const spacing = 6;
    let options = JSON.stringify(staticOptions.value, null, spacing);
    options = options.replace(/\"([^(\")"]+)\":/g, '$1:');
    options = options.replace(/\"/g, `'`);
    options = options.slice(0, options.length - 1) + '    }';
    symbol += `.${staticOptions.name}(${options})`;
    return symbol;
  }

  private addBlankLines(expr: string): string {
    return `\n    ${expr}\n  `;
  }
}
