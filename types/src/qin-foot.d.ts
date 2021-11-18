export declare enum QinFilesNature {
    BOTH = "both",
    DIRECTORIES = "directories",
    FILES = "files"
}
export declare enum QinFilesOperation {
    OPEN = "open",
    SAVE = "save"
}
export declare class QinFilesDescriptor {
    description: string;
    extensions: string[];
}
declare function getLocation(): string;
declare function isLocalHost(): boolean;
declare function getSeparator(ofPath: string): string;
declare function getPathJoin(pathA: string, pathB: string): string;
declare function getRoot(path: string): string;
declare function getStem(path: string): string;
declare function getFileExtension(name: string): string;
declare function isFileApp(extension: string): boolean;
declare function isFileCmd(extension: string): boolean;
declare function isFileExec(extension: string): boolean;
declare function isFileImage(extension: string): boolean;
declare function isFileVector(extension: string): boolean;
declare function isFileMovie(extension: string): boolean;
declare function isFileMusic(extension: string): boolean;
declare function isFileZipped(extension: string): boolean;
export declare const QinFoot: {
    getLocation: typeof getLocation;
    isLocalHost: typeof isLocalHost;
    getSeparator: typeof getSeparator;
    getPathJoin: typeof getPathJoin;
    getRoot: typeof getRoot;
    getStem: typeof getStem;
    getFileExtension: typeof getFileExtension;
    isFileApp: typeof isFileApp;
    isFileCmd: typeof isFileCmd;
    isFileExec: typeof isFileExec;
    isFileImage: typeof isFileImage;
    isFileVector: typeof isFileVector;
    isFileMovie: typeof isFileMovie;
    isFileMusic: typeof isFileMusic;
    isFileZipped: typeof isFileZipped;
};
export {};
//# sourceMappingURL=qin-foot.d.ts.map