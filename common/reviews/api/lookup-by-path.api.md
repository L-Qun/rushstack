## API Report File for "@rushstack/lookup-by-path"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @beta
export interface IPrefixMatch<TItem> {
    index: number;
    lastMatch?: IPrefixMatch<TItem>;
    value: TItem;
}

// @beta
export class LookupByPath<TItem> {
    constructor(entries?: Iterable<[string, TItem]>, delimiter?: string);
    readonly delimiter: string;
    findChildPath(childPath: string): TItem | undefined;
    findChildPathFromSegments(childPathSegments: Iterable<string>): TItem | undefined;
    findLongestPrefixMatch(query: string): IPrefixMatch<TItem> | undefined;
    static iteratePathSegments(serializedPath: string, delimiter?: string): Iterable<string>;
    setItem(serializedPath: string, value: TItem): this;
    setItemFromSegments(pathSegments: Iterable<string>, value: TItem): this;
}

```