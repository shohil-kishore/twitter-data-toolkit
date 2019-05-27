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
var Operation_1 = require("./Operation");
var IncludeOperation = (function (_super) {
    __extends(IncludeOperation, _super);
    function IncludeOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IncludeOperation.prototype.name = function () {
        return "include";
    };
    IncludeOperation.prototype.processInObject = function (keyword, source, target) {
        var keywordValue = source[keyword];
        var result = this._processor.loadFileByRef(keywordValue);
        return this._processor.processSource(result, target);
    };
    IncludeOperation.prototype.processInArray = function (keyword, source, sourceArray, sourceArrayIndex, resultArray, resultArrayIndex, target) {
        var keywordValue = source[keyword];
        var content = this._processor.loadFileByRef(keywordValue);
        return this._processor.processArrayItem(content, sourceArray, sourceArrayIndex, resultArray, resultArrayIndex, target);
    };
    return IncludeOperation;
}(Operation_1.default));
exports.default = IncludeOperation;
//# sourceMappingURL=IncludeOperation.js.map