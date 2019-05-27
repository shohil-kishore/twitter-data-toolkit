"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var protocolRegex = /^(?:[a-z]+:)?\/\//i;
var FsFileLoader = (function () {
    function FsFileLoader() {
    }
    FsFileLoader.prototype.match = function (uri, currentUri) {
        if (uri.substr(0, 7) === "file://") {
            return true;
        }
        if (protocolRegex.test(uri)) {
            return false;
        }
        if (currentUri.substr(0, 7) === "file://") {
            return true;
        }
        return !protocolRegex.test(currentUri);
    };
    FsFileLoader.prototype.toAbsoluteUri = function (uri, currentUri) {
        var cwd = path.dirname(currentUri);
        return path.resolve(cwd, uri);
    };
    FsFileLoader.prototype.load = function (uri) {
        return fs.readFileSync(uri, "utf8");
    };
    return FsFileLoader;
}());
exports.default = FsFileLoader;
//# sourceMappingURL=FsFileLoader.js.map