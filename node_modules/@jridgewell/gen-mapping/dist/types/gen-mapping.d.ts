import type { DecodedSourceMap, EncodedSourceMap, Pos, Mapping } from './types';
export type { DecodedSourceMap, EncodedSourceMap, Mapping };
export declare type Options = {
    file?: string | null;
    sourceRoot?: string | null;
};
export declare let addSegment: {
    (map: GenMapping, genLine: number, genColumn: number, source?: null, sourceLine?: null, sourceColumn?: null, name?: null): void;
    (map: GenMapping, genLine: number, genColumn: number, source: string, sourceLine: number, sourceColumn: number, name?: null): void;
    (map: GenMapping, genLine: number, genColumn: number, source: string, sourceLine: number, sourceColumn: number, name: string): void;
};
export declare let addMapping: {
    (map: GenMapping, mapping: {
        generated: Pos;
        source?: null;
        original?: null;
        name?: null;
    }): void;
    (map: GenMapping, mapping: {
        generated: Pos;
        source: string;
        original: Pos;
        name?: null;
    }): void;
    (map: GenMapping, mapping: {
        generated: Pos;
        source: string;
        original: Pos;
        name: string;
    }): void;
};
export declare let setSourceContent: (map: GenMapping, source: string, content: string | null) => void;
export declare let decodedMap: (map: GenMapping) => DecodedSourceMap;
export declare let encodedMap: (map: GenMapping) => EncodedSourceMap;
export declare let allMappings: (map: GenMapping) => Mapping[];
/**
 * Provides the state to generate a sourcemap.
 */
export declare class GenMapping {
    private _names;
    private _sources;
    private _sourcesContent;
    private _mappings;
    file: string | null | undefined;
    sourceRoot: string | null | undefined;
    constructor({ file, sourceRoot }?: Options);
}
