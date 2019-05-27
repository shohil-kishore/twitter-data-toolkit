"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../utils/types");
var Operation_1 = require("./Operation");
var ImportOperation = (function (_super) {
    __extends(ImportOperation, _super);
    function ImportOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImportOperation.prototype.name = function () {
        return "import";
    };
    ImportOperation.prototype.processInObject = function (keyword, source, target) {
        var _this = this;
        var keywordValue = source[keyword];
        var importValues = Array.isArray(keywordValue) ? keywordValue : [keywordValue];
        var importResult = importValues.reduce(function (result, importValue) {
            if (typeof importValue === "string") {
                return _this._processor.loadAndProcessFileByRef(importValue, result);
            }
            if (typeof importValue.path !== "string") {
                return result;
            }
            var scopeVariables;
            if (types_1.isObject(importValue.params)) {
                scopeVariables = {};
                scopeVariables.$params = _this._processor.processSourceProperty(importValue.params, "params");
            }
            return _this._processor.loadAndProcessFileByRef(importValue.path, result, scopeVariables);
        }, undefined);
        return this._processor.processSource(importResult, target);
    };
    return ImportOperation;
}(Operation_1.default));
exports.default = ImportOperation;
//# sourceMappingURL=ImportOperation.js.map