"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonFileRegex = /\.json$/;
var JSONDataSerializer = (function () {
    function JSONDataSerializer() {
    }
    JSONDataSerializer.prototype.match = function (uri) {
        return jsonFileRegex.test(uri);
    };
    JSONDataSerializer.prototype.serialize = function (_, data, pretty) {
        var space = pretty ? "\t" : undefined;
        return JSON.stringify(data, null, space);
    };
    return JSONDataSerializer;
}());
exports.default = JSONDataSerializer;
//# sourceMappingURL=JSONDataSerializer.js.map