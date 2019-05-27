"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileLoader = (function () {
    function FileLoader() {
        this._uriCache = {};
        this._loaders = [];
    }
    FileLoader.prototype.load = function (uri, currentUri) {
        var loader = this._loaders.filter(function (x) { return x.loader.match(uri, currentUri); })[0];
        if (loader === undefined) {
            throw new Error("No file loader found for file \"" + uri + "\"");
        }
        var absoluteUri = loader.loader.toAbsoluteUri(uri, currentUri);
        return loader.loader.load(absoluteUri);
    };
    FileLoader.prototype.addLoader = function (loader, priority) {
        this._loaders.push({ loader: loader, priority: priority });
        this._loaders = this._loaders.sort(function (a, b) { return -(a.priority - b.priority); });
    };
    FileLoader.prototype.addLoaders = function (loaders) {
        var _this = this;
        loaders.forEach(function (x) { return _this.addLoader(x[0], x[1]); });
    };
    FileLoader.prototype.toAbsoluteUri = function (uri, currentUri) {
        var cacheKey = uri + currentUri;
        if (this._uriCache[cacheKey]) {
            return this._uriCache[cacheKey];
        }
        var loader = this._loaders.filter(function (x) { return x.loader.match(uri, currentUri); })[0];
        if (!loader) {
            return;
        }
        var absoluteUri = loader.loader.toAbsoluteUri(uri, currentUri);
        this._uriCache[cacheKey] = absoluteUri;
        return absoluteUri;
    };
    FileLoader.prototype.clearCache = function () {
        this._uriCache = {};
    };
    return FileLoader;
}());
exports.default = FileLoader;
//# sourceMappingURL=FileLoader.js.map