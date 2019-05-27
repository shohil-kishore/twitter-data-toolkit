"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataDeserializer = (function () {
    function DataDeserializer() {
        this._deserializers = [];
    }
    DataDeserializer.prototype.deserialize = function (uri, content) {
        var deserializer = this._deserializers.filter(function (x) { return x.match(uri); })[0];
        if (!deserializer) {
            throw new Error("No deserializer found for file \"" + uri + "\"");
        }
        return deserializer.deserialize(uri, content);
    };
    DataDeserializer.prototype.addDeserializer = function (deserializer) {
        this._deserializers.push(deserializer);
    };
    DataDeserializer.prototype.addDeserializers = function (deserializers) {
        var _this = this;
        deserializers.forEach(function (deserializer) { return _this.addDeserializer(deserializer); });
    };
    return DataDeserializer;
}());
exports.default = DataDeserializer;
//# sourceMappingURL=DataDeserializer.js.map