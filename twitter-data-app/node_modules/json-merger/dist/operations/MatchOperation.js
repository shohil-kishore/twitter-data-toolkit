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
var jsonpath = require("jsonpath");
var jsonPtr = require("json-ptr");
var Operation_1 = require("./Operation");
var MatchOperation = (function (_super) {
    __extends(MatchOperation, _super);
    function MatchOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatchOperation.prototype.name = function () {
        return "match";
    };
    MatchOperation.prototype.processInArray = function (keyword, source, sourceArray, sourceArrayIndex, resultArray, resultArrayIndex, target) {
        var keywordValue = source[keyword];
        var matchedResultArrayIndex;
        if (keywordValue.index !== undefined) {
            matchedResultArrayIndex = keywordValue.index === "-" ? resultArray.length - 1 : keywordValue.index;
        }
        else if (keywordValue.query !== undefined) {
            var path = jsonpath.paths(resultArray, keywordValue.query)[0];
            matchedResultArrayIndex = path !== undefined ? path[1] : undefined;
        }
        else if (keywordValue.path !== undefined) {
            if (jsonPtr.get(resultArray, keywordValue.path) !== undefined) {
                matchedResultArrayIndex = jsonPtr.decodePointer(keywordValue.path)[0][0];
            }
        }
        if (matchedResultArrayIndex === undefined || resultArray[matchedResultArrayIndex] === undefined) {
            return { resultArray: resultArray, resultArrayIndex: resultArrayIndex };
        }
        var result = this._processor.processArrayItem(keywordValue.value, sourceArray, sourceArrayIndex, resultArray, matchedResultArrayIndex, target);
        if (matchedResultArrayIndex <= resultArrayIndex) {
            resultArrayIndex += result.resultArrayIndex - matchedResultArrayIndex;
        }
        return { resultArray: result.resultArray, resultArrayIndex: resultArrayIndex };
    };
    return MatchOperation;
}(Operation_1.default));
exports.default = MatchOperation;
//# sourceMappingURL=MatchOperation.js.map