"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yaml = require("js-yaml");
var yamlFileRegex = /\.ya?ml$/;
var YAMLDataDeserializer = (function () {
    function YAMLDataDeserializer() {
    }
    YAMLDataDeserializer.prototype.match = function (uri) {
        return yamlFileRegex.test(uri);
    };
    YAMLDataDeserializer.prototype.deserialize = function (uri, content) {
        return yaml.safeLoad(content, {
            filename: uri,
            schema: yaml.JSON_SCHEMA
        });
    };
    return YAMLDataDeserializer;
}());
exports.default = YAMLDataDeserializer;
//# sourceMappingURL=YAMLDataDeserializer.js.map