"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataLoader = (function () {
    function DataLoader(_config, _dataDeserializer, _fileLoader) {
        this._config = _config;
        this._dataDeserializer = _dataDeserializer;
        this._fileLoader = _fileLoader;
        this._cache = {};
    }
    DataLoader.prototype.load = function (uri, currentUri) {
        var absoluteUri = this.toAbsoluteUri(uri, currentUri);
        if (this._cache[absoluteUri]) {
            return this._cache[absoluteUri];
        }
        var content;
        try {
            content = this._fileLoader.load(uri, currentUri);
        }
        catch (e) {
            if (this._config.errorOnFileNotFound) {
                throw new Error("The file \"" + uri + "\" does not exist. Set Config.errorOnFileNotFound to false to suppress this message");
            }
            return;
        }
        var result;
        if (content !== undefined) {
            result = this._dataDeserializer.deserialize(uri, content);
        }
        this._cache[absoluteUri] = result;
        return result;
    };
    DataLoader.prototype.toAbsoluteUri = function (uri, currentUri) {
        return this._fileLoader.toAbsoluteUri(uri, currentUri);
    };
    DataLoader.prototype.clearCache = function () {
        this._cache = {};
        this._fileLoader.clearCache();
    };
    return DataLoader;
}());
exports.default = DataLoader;
//# sourceMappingURL=DataLoader.js.map