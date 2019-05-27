"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var DataLoader_1 = require("./DataLoader");
var MergerError_1 = require("./MergerError");
var Processor_1 = require("./Processor");
var FileLoader_1 = require("./fileLoaders/FileLoader");
var FsFileLoader_1 = require("./fileLoaders/FsFileLoader");
var DataDeserializer_1 = require("./dataDeserializers/DataDeserializer");
var JSONDataDeserializer_1 = require("./dataDeserializers/JSONDataDeserializer");
var YAMLDataDeserializer_1 = require("./dataDeserializers/YAMLDataDeserializer");
var DataSerializer_1 = require("./dataSerializers/DataSerializer");
var JSONDataSerializer_1 = require("./dataSerializers/JSONDataSerializer");
var AfterMergeOperation_1 = require("./operations/AfterMergeOperation");
var AfterMergesOperation_1 = require("./operations/AfterMergesOperation");
var AppendOperation_1 = require("./operations/AppendOperation");
var ConcatOperation_1 = require("./operations/ConcatOperation");
var ExpressionOperation_1 = require("./operations/ExpressionOperation");
var ImportOperation_1 = require("./operations/ImportOperation");
var IncludeOperation_1 = require("./operations/IncludeOperation");
var InsertOperation_1 = require("./operations/InsertOperation");
var MatchOperation_1 = require("./operations/MatchOperation");
var MergeOperation_1 = require("./operations/MergeOperation");
var MoveOperation_1 = require("./operations/MoveOperation");
var PrependOperation_1 = require("./operations/PrependOperation");
var RemoveOperation_1 = require("./operations/RemoveOperation");
var RepeatOperation_1 = require("./operations/RepeatOperation");
var ReplaceOperation_1 = require("./operations/ReplaceOperation");
var SelectOperation_1 = require("./operations/SelectOperation");
var Merger = (function () {
    function Merger(config) {
        this._config = new Config_1.default(config);
        this._fileLoader = new FileLoader_1.default();
        this._fileLoader.addLoaders([
            [new FsFileLoader_1.default(), 1]
        ]);
        this._dataDeserializer = new DataDeserializer_1.default();
        this._dataDeserializer.addDeserializers([
            new JSONDataDeserializer_1.default(),
            new YAMLDataDeserializer_1.default()
        ]);
        this._dataSerializer = new DataSerializer_1.default();
        this._dataSerializer.addSerializers([
            new JSONDataSerializer_1.default()
        ]);
        this._dataLoader = new DataLoader_1.default(this._config, this._dataDeserializer, this._fileLoader);
        this._processor = new Processor_1.default(this._config, this._dataLoader);
        this._processor.addOperations([
            new RemoveOperation_1.default(this._processor),
            new ReplaceOperation_1.default(this._processor),
            new ExpressionOperation_1.default(this._processor),
            new ImportOperation_1.default(this._processor),
            new ConcatOperation_1.default(this._processor),
            new AppendOperation_1.default(this._processor),
            new PrependOperation_1.default(this._processor),
            new InsertOperation_1.default(this._processor),
            new SelectOperation_1.default(this._processor),
            new RepeatOperation_1.default(this._processor),
            new MatchOperation_1.default(this._processor),
            new MoveOperation_1.default(this._processor),
            new MergeOperation_1.default(this._processor),
            new IncludeOperation_1.default(this._processor),
            new AfterMergeOperation_1.default(this._processor),
            new AfterMergesOperation_1.default(this._processor)
        ]);
    }
    Merger.prototype.mergeObject = function (object, config) {
        var sources = [{ type: 0, object: object }];
        return this._merge(sources, config);
    };
    Merger.prototype.mergeObjects = function (objects, config) {
        var sources = objects.map(function (object) { return ({ type: 0, object: object }); });
        return this._merge(sources, config);
    };
    Merger.prototype.mergeFile = function (uri, config) {
        var sources = [{ type: 1, uri: uri }];
        return this._merge(sources, config);
    };
    Merger.prototype.mergeFiles = function (uris, config) {
        var sources = uris.map(function (uri) { return ({ type: 1, uri: uri }); });
        return this._merge(sources, config);
    };
    Merger.prototype.setConfig = function (config) {
        this._config.set(config);
    };
    Merger.prototype.clearCaches = function () {
        this._dataLoader.clearCache();
    };
    Merger.prototype._merge = function (sources, config) {
        if (config !== undefined) {
            this.setConfig(config);
        }
        var result;
        try {
            result = this._processor.merge(sources);
        }
        catch (e) {
            throw new MergerError_1.default(e, this._processor.currentScope);
        }
        if (this._config.stringify) {
            var pretty = this._config.stringify === "pretty";
            result = this._dataSerializer.serialize(".json", result, pretty);
        }
        return result;
    };
    return Merger;
}());
exports.default = Merger;
//# sourceMappingURL=Merger.js.map