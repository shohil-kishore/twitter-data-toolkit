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
var ConcatOperation = (function (_super) {
    __extends(ConcatOperation, _super);
    function ConcatOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConcatOperation.prototype.name = function () {
        return "concat";
    };
    ConcatOperation.prototype.processInObject = function (keyword, source, target) {
        var keywordValue = source[keyword];
        var processedSource = this._processor.processSource(keywordValue);
        return [].concat(target, processedSource);
    };
    return ConcatOperation;
}(Operation_1.default));
exports.default = ConcatOperation;
//# sourceMappingURL=ConcatOperation.js.map