"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonFileRegex = /\.json$/;
var JSONDataDeserializer = (function () {
    function JSONDataDeserializer() {
    }
    JSONDataDeserializer.prototype.match = function (uri) {
        return jsonFileRegex.test(uri);
    };
    JSONDataDeserializer.prototype.deserialize = function (_, content) {
        return JSON.parse(content);
    };
    return JSONDataDeserializer;
}());
exports.default = JSONDataDeserializer;
//# sourceMappingURL=JSONDataDeserializer.js.map