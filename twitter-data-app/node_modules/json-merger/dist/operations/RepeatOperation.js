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
var range = require("lodash.range");
var Operation_1 = require("./Operation");
var types_1 = require("../utils/types");
var RepeatOperation = (function (_super) {
    __extends(RepeatOperation, _super);
    function RepeatOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RepeatOperation.prototype.name = function () {
        return "repeat";
    };
    RepeatOperation.prototype.processInObject = function (keyword, source, target) {
        var _this = this;
        var keywordValue = source[keyword];
        var result;
        var step = 1;
        var values = [];
        if (typeof keywordValue.step === "number") {
            step = keywordValue.step;
        }
        if (typeof keywordValue.from === "number") {
            var from = keywordValue.from;
            var to = from + 1;
            if (typeof keywordValue.to === "number") {
                to = keywordValue.to;
            }
            else if (typeof keywordValue.through === "number") {
                to = keywordValue.through;
                to = to > 0 ? to + 1 : to - 1;
            }
            var normStep = to < from ? -Math.abs(step) : Math.abs(step);
            values = range(from, to, normStep).map(function (i) { return ({ value: i }); });
        }
        else if (typeof keywordValue.range === "string") {
            var items = keywordValue.range.replace(/,/g, " ").replace(/\s+/g, " ").split(" ");
            items.forEach(function (item) {
                var split = item.split(":");
                var itemFrom = Number(split[0]);
                var itemTo = Number(split[1]);
                var itemStep = Number(split[2]);
                if (isNaN(itemFrom)) {
                    return;
                }
                if (isNaN(itemStep)) {
                    itemStep = step;
                }
                if (isNaN(itemTo)) {
                    itemTo = itemFrom;
                }
                itemTo = itemTo > 0 ? itemTo + 1 : itemTo - 1;
                itemStep = itemTo < itemFrom ? -Math.abs(itemStep) : Math.abs(itemStep);
                range(itemFrom, itemTo, itemStep).forEach(function (i) { return values.push({ value: i }); });
            });
        }
        else if (keywordValue.in !== undefined) {
            var processedIn = this._processor.processSourceProperty(keywordValue.in, "in");
            if (Array.isArray(processedIn)) {
                values = processedIn.map(function (value) { return ({ value: value }); });
            }
            else if (types_1.isObject(processedIn)) {
                var obj_1 = processedIn;
                values = Object.keys(obj_1).map(function (key) { return ({ key: key, value: obj_1[key] }); });
            }
        }
        var repeatResult = values.map(function (value, index) {
            var scopeVariables = {
                $repeat: {
                    index: index,
                    key: value.key !== undefined ? value.key : index,
                    value: value.value
                }
            };
            return _this._processor.processSourcePropertyInNewScope(keywordValue.value, "value", undefined, scopeVariables);
        });
        this._processor.disableOperations();
        result = this._processor.processSource(repeatResult, target);
        this._processor.enableOperations();
        return result;
    };
    return RepeatOperation;
}(Operation_1.default));
exports.default = RepeatOperation;
//# sourceMappingURL=RepeatOperation.js.map