declare function getTextLines(fromText: string): string[];
declare function getCSVRows(fromText: string, names?: string[]): string[][] | object[];
declare function maskSpecialChars(fromText: string): string;
declare function unmaskSpecialChars(fromText: string): string;
export declare const QinBody: {
    getTextLines: typeof getTextLines;
    getCSVRows: typeof getCSVRows;
    maskSpecialChars: typeof maskSpecialChars;
    unmaskSpecialChars: typeof unmaskSpecialChars;
};
export {};
//# sourceMappingURL=qin-body.d.ts.map