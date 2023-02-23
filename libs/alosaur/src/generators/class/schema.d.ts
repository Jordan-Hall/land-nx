import { Path } from '@angular-devkit/core';

export interface ClassGeneratorSchema {
  /**
   * The name of the class.
   */
  name: string;
  /**
   * The path to create the class.
   */
  path?: string | Path;
  /**
   * The source root path.
   */
  sourceRoot?: string;
  /**
   * Class name to be used internally.
   */
  className?: string;
}
