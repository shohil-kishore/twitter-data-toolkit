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
var AppendOperation = (function (_super) {
    __extends(AppendOperation, _super);
    function AppendOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppendOperation.prototype.name = function () {
        return "append";
    };
    AppendOperation.prototype.processInArray = function (keyword, source, _sourceArray, _sourceArrayIndex, resultArray, resultArrayIndex, _target) {
        var keywordValue = source[keyword];
        var processedItem = this._processor.processSource(keywordValue);
        if (processedItem !== undefined) {
            resultArray.push(processedItem);
        }
        return { resultArray: resultArray, resultArrayIndex: resultArrayIndex };
    };
    return AppendOperation;
}(Operation_1.default));
exports.default = AppendOperation;
//# sourceMappingURL=AppendOperation.js.map