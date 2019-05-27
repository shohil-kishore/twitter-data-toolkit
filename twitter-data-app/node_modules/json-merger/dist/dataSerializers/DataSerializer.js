"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataSerializer = (function () {
    function DataSerializer() {
        this._serializers = [];
    }
    DataSerializer.prototype.serialize = function (uri, data, pretty) {
        var serializer = this._serializers.filter(function (x) { return x.match(uri); })[0];
        if (!serializer) {
            throw new Error("No serializer found for file \"" + uri + "\"");
        }
        return serializer.serialize(uri, data, pretty);
    };
    DataSerializer.prototype.addSerializer = function (serializer) {
        this._serializers.push(serializer);
    };
    DataSerializer.prototype.addSerializers = function (serializers) {
        var _this = this;
        serializers.forEach(function (serializer) { return _this.addSerializer(serializer); });
    };
    return DataSerializer;
}());
exports.default = DataSerializer;
//# sourceMappingURL=DataSerializer.js.map