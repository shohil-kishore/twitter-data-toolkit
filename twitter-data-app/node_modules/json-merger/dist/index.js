"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Merger_1 = require("./Merger");
exports.Merger = Merger_1.default;
function mergeObject(object, config) {
    var merger = new Merger_1.default(config);
    return merger.mergeObject(object);
}
exports.mergeObject = mergeObject;
function mergeObjects(objects, config) {
    var merger = new Merger_1.default(config);
    return merger.mergeObjects(objects);
}
exports.mergeObjects = mergeObjects;
function mergeFile(file, config) {
    var merger = new Merger_1.default(config);
    return merger.mergeFile(file);
}
exports.mergeFile = mergeFile;
function mergeFiles(files, config) {
    var merger = new Merger_1.default(config);
    return merger.mergeFiles(files);
}
exports.mergeFiles = mergeFiles;
exports.default = Merger_1.default;
//# sourceMappingURL=index.js.map