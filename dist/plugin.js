"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _generator = _interopRequireDefault(require("@babel/generator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["The function takes no arguments but was provided with ", "."]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var isAllowedExpression = function isAllowedExpression(node, types) {
  // https://babeljs.io/docs/en/next/babel-types.html#unaryexpression
  var unaryExpression = types.isUnaryExpression(node) && node.operator in ["!"] || types.isMemberExpression(node);
  var otherExpression = types.isLogicalExpression(node) || types.isConditionalExpression(node) || types.isCallExpression(node);
  return unaryExpression || types.isBinaryExpression(node) || otherExpression;
};

function _default(_ref) {
  var t = _ref.types;
  return {
    visitor: {
      Function: function Function(path) {
        // Validate that the function is called correctly
        //
        if (path.node.params.length == 0) {
          // if the function takes no arguments...
          // Check that the function is not called with any arguments
          if (t.isCallExpression(path.parentPath.node) && path.parentPath.node.arguments.length > 0) {
            throw path.buildCodeFrameError(f(_templateObject(), path.parentPath.node.arguments.length));
          }
        } else if (path.node.params.length > 0) {
          // Check that the function is called with
          // a sufficient number of arguments
          if (t.isCallExpression(path.parentPath.node) && path.parentPath.node.arguments.length != path.node.params.length) {
            throw path.buildCodeFrameError("The function takes ".concat(path.node.params.length, " parameters but was provided with ").concat(path.parentPath.node.arguments.length, " arguments.")); // (x,y,z) => {...}
            // fail; the function needs to be wrapped in a call. ((x,y,z) => {...})(1,2,3)
          } else if (!t.isCallExpression(path.parentPath.node)) {
            throw path.buildCodeFrameError("Functions with arguments must be wrapped in a call expression.");
          }
        } // Transform the provided valid code
        //


        var code;

        if (t.isBlockStatement(path.node.body)) {
          // If the function body is a block statement, 
          // then if the function takes no arguments, 
          // and is not already wrapped in a call expression, 
          // lets do it for the user.
          if (path.node.params.length == 0 && !t.isCallExpression(path.parentPath.node)) {
            // replaces the uncalled function () => {} with ({} => {})()
            path.replaceWith(t.CallExpression(path.node, []));
          }
        } else if (isAllowedExpression(path.node.body, t)) {
          // If the body is an expression
          // if no arguments are given to the function
          // then lets simplify this all and just keep the expression
          if (path.node.params.length == 0) {
            // print and return
            path.replaceWith(path.node.body);
          }
        }
      },
      Expression: function Expression(path) {
        // We only want to handle expressions that need to be 
        // transformed into their own eval string
        // So we must not match any bad types of expressions:
        //      ie.e. assignments, objects, arrays, returns 
        // anything that we don't expect as a leaf of the autoconfig object tree
        // 
        // Don't operate on expressions inside a function or a call expression
        if (path.findParent(function (path) {
          return path.isFunction();
        })) {
          return;
        }

        if (path.findParent(function (path) {
          return path.isCallExpression();
        })) {
          return;
        } // and don't operate on expressions that arent whitelisted (arrays, return statements...):


        if (!isAllowedExpression(path.node, t)) {
          return;
        }

        var _generate = (0, _generator["default"])(path.node, {
          concise: true
        }),
            code = _generate.code;

        path.replaceWithSourceString("\" ".concat(code, "\""));
      }
    }
  };
}

;