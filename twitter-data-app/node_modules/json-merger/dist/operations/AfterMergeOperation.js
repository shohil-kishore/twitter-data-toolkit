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
var AfterMergeOperation = (function (_super) {
    __extends(AfterMergeOperation, _super);
    function AfterMergeOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AfterMergeOperation.prototype.name = function () {
        return "afterMerge";
    };
    AfterMergeOperation.prototype.processInObject = function (keyword, source, target) {
        if (this._processor.currentScope.phase !== "afterMerge") {
            this._processor.currentScope.registerPhase("afterMerge");
            return source;
        }
        var keywordValue = source[keyword];
        return this._processor.processSource(keywordValue, target);
    };
    return AfterMergeOperation;
}(Operation_1.default));
exports.default = AfterMergeOperation;
//# sourceMappingURL=AfterMergeOperation.js.map