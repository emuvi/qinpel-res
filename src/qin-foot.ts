export enum QinFilesNature {
    BOTH = "both",
    DIRECTORIES = "directories",
    FILES = "files",
}

export enum QinFilesOperation {
    OPEN = "open",
    SAVE = "save",
}

export class QinFilesDescriptor {
    public description: string;
    public extensions: string[];
}

function getLocation() {
    return window.location.href;
}

function isLocalHost() {
    var location = getLocation();
    var start = location.indexOf("://");
    if (start == -1) { start = 0; }
    else { start += 3 }
    location = location.substring(start);
    return location.indexOf("localhost") === 0 || location.indexOf("127.0.0.1") === 0
}

function getSeparator(ofPath: string): string {
    let result = "/";
    if (ofPath && ofPath.indexOf("\\") > -1) {
        result = "\\";
    }
    return result;
}

function getPathJoin(pathA: string, pathB: string): string {
    if (pathA == null || pathA == undefined) {
        pathA = "";
    }
    if (pathB == null || pathB == undefined) {
        pathB = "";
    }
    if (pathA.length == 0) {
        return pathB;
    } else if (pathB.length == 0) {
        return pathA;
    } else {
        let union = "/";
        if (pathA.indexOf("\\") > -1 || pathB.indexOf("\\") > -1) {
            union = "\\";
        }
        let pathAEnd = pathA.substring(pathA.length - 1, pathA.length);
        let pathBStart = pathB.substring(0, 1);
        if (pathAEnd == union || pathBStart == union) {
            union = "";
        }
        return pathA + union + pathB;
    }
}

function getParent(path: string): string {
    if (path) {
        let separator = getSeparator(path);
        let last = path.lastIndexOf(separator);
        if (last > -1) {
            return path.substring(0, last);
        }
    }
    return "";
}

function getStem(path: string): string {
    if (path) {
        let separator = getSeparator(path);
        let last = path.lastIndexOf(separator);
        if (last > -1) {
            return path.substring(last + 1);
        }
    }
    return "";
}

function getFileExtension(name: string): string {
    let position = name.lastIndexOf(".");
    if (position > -1) {
        return name.substring(position + 1);
    } else {
        return "";
    }
}

const appsExtensions = [
    "htm", "html", "css", "js", "jsx", "ts", "tsx", "phtml"
];

function isFileApp(extension: string): boolean {
    return appsExtensions.indexOf(extension) > -1;
}

const cmdsExtensions = [
    "h", "c", "hpp", "cpp", "rs", "jl",
    "cs", "csproj", "fs", "ml", "fsi", "mli", "fsx", "fsscript",
    "java", "gy", "gvy", "groovy", "sc", "scala", "clj",
    "py", "ruby", "php", "phtml",
];

function isFileCmd(extension: string): boolean {
    return cmdsExtensions.indexOf(extension) > -1;
}

const execExtensions = [
    "exe", "jar", "com", "bat", "sh"
];

function isFileExec(extension: string): boolean {
    return execExtensions.indexOf(extension) > -1;
}

const imageExtensions = [
    "jpg", "jpeg", "png", "gif", "bmp"
];

function isFileImage(extension: string): boolean {
    return imageExtensions.indexOf(extension) > -1;
}

const vectorExtensions = [
    "svg"
];

function isFileVector(extension: string): boolean {
    return vectorExtensions.indexOf(extension) > -1;
}

const movieExtensions = [
    "avi", "mp4"
];

function isFileMovie(extension: string): boolean {
    return movieExtensions.indexOf(extension) > -1;
}

const musicExtensions = [
    "wav", "mp3"
];

function isFileMusic(extension: string): boolean {
    return musicExtensions.indexOf(extension) > -1;
}

const zippedExtensions = [
    "zip", "rar", "7z", "tar", "gz"
];

function isFileZipped(extension: string): boolean {
    return zippedExtensions.indexOf(extension) > -1;
}

export const QinFoot = {
    getLocation,
    isLocalHost,
    getSeparator,
    getPathJoin,
    getParent,
    getStem,
    getFileExtension,
    isFileApp,
    isFileCmd,
    isFileExec,
    isFileImage,
    isFileVector,
    isFileMovie,
    isFileMusic,
    isFileZipped,
};