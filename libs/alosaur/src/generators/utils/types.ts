/**
 * Credit to Nrwl for @nrwl/nest in which this is basically they types for nestjs changed for Alosaur
 */


export type AlosaurSchematic =
  | 'class'
  | 'controller'
  | 'middleware'
  | 'microservice'
  | 'area'
  | 'application'
  | 'service';

export type TransportLayer =
  | 'TCP'

export type AlosaurGeneratorOptions = {
  name: string;
  project: string;
  directory?: string;
  flat?: boolean;
  skipFormat?: boolean;
};

export type AlosaurWithAreaeOption = AlosaurGeneratorOptions & {
  area?: string;
  skipImport?: boolean;
};

export type AlosaurWithResourceOption = AlosaurGeneratorOptions & {
  type?: TransportLayer;
};

export type AlosaurGenerator = AlosaurGeneratorOptions | AlosaurWithAreaeOption | AlosaurWithResourceOption;

export type NormalizedOptions = {
  name: string;
  sourceRoot: string;
  flat?: boolean;
  area?: string;
  path?: string;
  skipFormat?: boolean;
  skipImport?: boolean;
  spec?: boolean;
};
