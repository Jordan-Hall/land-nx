import { basename, dirname, relative, normalize } from 'path';

export class PathSolver {
  public relative(from: string, to: string): string {
    const relativeDir = relative(
      dirname(normalize(from)),
      dirname(normalize(to)),
    );
    return (relativeDir.startsWith('.')
      ? relativeDir
      : './' + relativeDir
    ).concat(relativeDir.length === 0 ? basename(to) : '/' + basename(to));
  }
}
