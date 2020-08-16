"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fs = _interopRequireWildcard(require("fs"));

var filepath = _interopRequireWildcard(require("path"));

var parser = _interopRequireWildcard(require("@babel/parser"));

var types = _interopRequireWildcard(require("@babel/types"));

var babel = _interopRequireWildcard(require("@babel/core"));

var _minimist = _interopRequireDefault(require("minimist"));

var _plugin = _interopRequireDefault(require("./plugin.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

module.exports = function () {
  var argv = (0, _minimist["default"])(process.argv.slice(2));
  var fileToTransform = argv._[0];

  if (!fs.existsSync(fileToTransform)) {
    console.error("File ".concat(fileToTransform, " does not exist."));
    return;
  }

  fs.readFile(fileToTransform, {
    encoding: 'utf8'
  }, function (err, data) {
    var autoconfig;

    try {
      autoconfig = parser.parseExpression(data);
    } catch (err) {
      throw SyntaxError("Expected a JSON-like {...} object expression. " + err + " " + data);
    } // Get the JSON-like object into a shape that can be parsed like a javascript file


    autoconfig = types.program([types.variableDeclaration("const", [types.variableDeclarator(types.identifier("_gunbotacgen"), autoconfig)])]); // parse it like a javscript file, using our custom plugin

    babel.transformFromAst(autoconfig, null, {
      plugins: [_plugin["default"]]
    }, function (err, result) {
      if (err) {
        console.log(err);
        return;
      } // Undo the earlier shaping of the JSON-like object


      var removeShim = function removeShim(code) {
        // Remove the first line "const _gunbotacgen = {" and replace it with "{"
        var lines = code.split('\n');
        lines.splice(0, 1, "{"); // Remove the last line "};" and replace it with "}"

        lines.splice(lines.length - 1, 1, "}");
        return lines.join('\n');
      }; // finish up


      fs.writeFile(filepath.dirname(fileToTransform) + "/autoconfig.json", removeShim(result.code), {}, function (err) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("New autoconfig written to " + filepath.dirname(fileToTransform) + "/autoconfig.json");
      });
    });
  });
};