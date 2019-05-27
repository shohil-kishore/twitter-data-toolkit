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
var MergeOperation = (function (_super) {
    __extends(MergeOperation, _super);
    function MergeOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MergeOperation.prototype.name = function () {
        return "merge";
    };
    MergeOperation.prototype.processInObject = function (keyword, source, target) {
        var keywordValue = source[keyword];
        var processedSourceProperty = this._processor.processSourcePropertyInNewMergeObjectScope(keywordValue.source, "source");
        var processedWithProperty = this._processor.processSourcePropertyInNewMergeObjectScope(keywordValue.with, "with", processedSourceProperty);
        return this._processor.processSource(processedWithProperty, target);
    };
    return MergeOperation;
}(Operation_1.default));
exports.default = MergeOperation;
//# sourceMappingURL=MergeOperation.js.map