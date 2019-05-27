"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operation = (function () {
    function Operation(processor) {
        this._processor = processor;
    }
    Operation.prototype.processInObject = function (_keyword, _source, _target) {
        return {};
    };
    Operation.prototype.processInArray = function (keyword, source, _sourceArray, _sourceArrayIndex, resultArray, resultArrayIndex, _target) {
        resultArray[resultArrayIndex] = this.processInObject(keyword, source, resultArray[resultArrayIndex]);
        return { resultArray: resultArray, resultArrayIndex: resultArrayIndex };
    };
    return Operation;
}());
exports.default = Operation;
//# sourceMappingURL=Operation.js.map