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
var MoveOperation = (function (_super) {
    __extends(MoveOperation, _super);
    function MoveOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoveOperation.prototype.name = function () {
        return "move";
    };
    MoveOperation.prototype.processInArray = function (keyword, source, _sourceArray, _sourceArrayIndex, resultArray, resultArrayIndex, _target) {
        var keywordValue = source[keyword];
        var item = resultArray.splice(resultArrayIndex, 1)[0];
        resultArrayIndex--;
        var index;
        if (typeof keywordValue === "number" || keywordValue === "-") {
            index = keywordValue;
        }
        else {
            index = keywordValue.index;
            if (keywordValue.value !== undefined) {
                item = this._processor.processSourceProperty(keywordValue.value, "value", item);
            }
        }
        if (index === "-") {
            index = resultArray.length;
        }
        resultArray.splice(index, 0, item);
        resultArrayIndex = index <= resultArrayIndex ? resultArrayIndex + 1 : resultArrayIndex;
        return { resultArray: resultArray, resultArrayIndex: resultArrayIndex };
    };
    return MoveOperation;
}(Operation_1.default));
exports.default = MoveOperation;
//# sourceMappingURL=MoveOperation.js.map