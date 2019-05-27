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
var RemoveOperation = (function (_super) {
    __extends(RemoveOperation, _super);
    function RemoveOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemoveOperation.prototype.name = function () {
        return "remove";
    };
    RemoveOperation.prototype.processInObject = function (keyword, source, target) {
        var keywordValue = source[keyword];
        if (keywordValue === true) {
            return undefined;
        }
        return target;
    };
    RemoveOperation.prototype.processInArray = function (keyword, source, _sourceArray, _sourceArrayIndex, resultArray, resultArrayIndex, _target) {
        var keywordValue = source[keyword];
        if (keywordValue === true) {
            resultArray.splice(resultArrayIndex, 1);
            resultArrayIndex--;
        }
        return { resultArray: resultArray, resultArrayIndex: resultArrayIndex };
    };
    return RemoveOperation;
}(Operation_1.default));
exports.default = RemoveOperation;
//# sourceMappingURL=RemoveOperation.js.map