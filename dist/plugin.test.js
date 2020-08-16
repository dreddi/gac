"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _babelPluginTester = _interopRequireDefault(require("babel-plugin-tester"));

var path = _interopRequireWildcard(require("path"));

var _plugin = _interopRequireDefault(require("./plugin.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var prep = function prep(code) {
  return "config = " + code.trim() + ";";
};

(0, _babelPluginTester["default"])({
  plugin: _plugin["default"],
  pluginName: "autoconfig-rewriter",
  snapshot: true,
  tests: [{
    title: 'empty-autoconfig',
    code: prep("\n{}\n            ")
  }, {
    title: "arrow-function-expression",
    code: prep("\n{\n    \"target\": () => {\n        var today = new Date();\n        return today.getDay() == 3;\n    }\n}\n                ")
  }, {
    title: "conditional-expression",
    code: prep("\n{\n    \"target\": parseFloat(this.pair.currentQty) > 0 ? 1 : 2\n}\n                ")
  }]
});