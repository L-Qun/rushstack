## API Report File for "@rushstack/webpack5-localization-plugin"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="node" />

import type { Chunk } from 'webpack';
import type { Compilation } from 'webpack';
import type { Compiler } from 'webpack';
import { ILocalizationFile } from '@rushstack/localization-utilities';
import type { IPseudolocaleOptions } from '@rushstack/localization-utilities';
import type { LoaderContext } from 'webpack';
import type { WebpackPluginInstance } from 'webpack';

// @public (undocumented)
export interface IDefaultLocaleOptions {
    fillMissingTranslationStrings?: boolean;
    localeName: string;
}

// @public (undocumented)
export interface ILocaleData {
    // (undocumented)
    [locFilePath: string]: ILocaleFileData;
}

// @public (undocumented)
export interface ILocaleElementMap {
    // (undocumented)
    [locale: string]: string;
}

// @public
export type ILocaleFileData = string | ILocaleFileObject | ReadonlyMap<string, string>;

// @public (undocumented)
export interface ILocaleFileObject {
    // (undocumented)
    [stringName: string]: string;
}

// @public
export interface ILocalizationPluginOptions {
    formatLocaleForFilename?: (locale: string) => string;
    globsToIgnore?: string[];
    localizationStats?: ILocalizationStatsOptions;
    localizedData: ILocalizedData;
    noStringsLocaleName?: string;
    realContentHash?: boolean;
    runtimeLocaleExpression?: string;
}

// @public (undocumented)
export interface ILocalizationStats {
    // (undocumented)
    entrypoints: {
        [name: string]: ILocalizationStatsEntrypoint;
    };
    // (undocumented)
    namedChunkGroups: {
        [name: string]: ILocalizationStatsChunkGroup;
    };
}

// @public (undocumented)
export interface ILocalizationStatsChunkGroup {
    // (undocumented)
    localizedAssets: ILocaleElementMap;
}

// @public (undocumented)
export interface ILocalizationStatsEntrypoint {
    // (undocumented)
    localizedAssets: ILocaleElementMap;
}

// @public
export interface ILocalizationStatsOptions {
    callback?: (stats: ILocalizationStats, compilation: Compilation) => void;
    dropPath?: string;
}

// @public (undocumented)
export interface ILocalizedData {
    defaultLocale: IDefaultLocaleOptions;
    passthroughLocale?: IPassthroughLocaleOptions;
    pseudolocales?: IPseudolocalesOptions;
    resolveMissingTranslatedStrings?: (locales: string[], localizedFileKey: string, loaderContext: LoaderContext<{}>) => Promise<IResolvedMissingTranslations> | IResolvedMissingTranslations;
    translatedStrings: ILocalizedStrings;
}

// @public (undocumented)
export interface ILocalizedStrings {
    // (undocumented)
    [locale: string]: ILocaleData;
}

// @public (undocumented)
export interface ILocalizedWebpackChunk extends Chunk {
    // (undocumented)
    localizedFiles?: {
        [locale: string]: string;
    };
}

// @public
export interface IPassthroughLocaleOptions {
    passthroughLocaleName?: string;
    usePassthroughLocale?: boolean;
}

// @public
export interface IPseudolocalesOptions {
    // (undocumented)
    [pseudoLocaleName: string]: IPseudolocaleOptions;
}

// @public (undocumented)
export type IResolvedMissingTranslations = ReadonlyMap<string, ILocaleFileData>;

// @public (undocumented)
export interface _IStringPlaceholder {
    locFilePath: string;
    stringName: string;
    suffix: string;
    translations: ReadonlyMap<string, ReadonlyMap<string, string>>;
    value: string;
}

// @public (undocumented)
export interface ITrueHashPluginOptions {
    hashFunction?: (contents: string | Buffer) => string;
    stageOverride?: number;
}

// @public
export class LocalizationPlugin implements WebpackPluginInstance {
    constructor(options: ILocalizationPluginOptions);
    // (undocumented)
    addDefaultLocFileAsync(context: LoaderContext<{}>, localizedFileKey: string, localizedResourceData: ILocalizationFile): Promise<Record<string, string>>;
    apply(compiler: Compiler): void;
    // @internal (undocumented)
    getDataForSerialNumber(serialNumber: string): _IStringPlaceholder | undefined;
    // (undocumented)
    getPlaceholder(localizedFileKey: string, stringName: string): _IStringPlaceholder | undefined;
    // @internal (undocumented)
    readonly _options: ILocalizationPluginOptions;
}

// @public (undocumented)
export class TrueHashPlugin implements WebpackPluginInstance {
    constructor(options?: ITrueHashPluginOptions);
    // (undocumented)
    apply(compiler: Compiler): void;
}

// (No @packageDocumentation comment for this package)

```
