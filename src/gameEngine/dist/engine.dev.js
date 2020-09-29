"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Creates a new box-shaped object. If height is omitted, a cube is created.
 * @param {number} xPos X position on screen (anchored to top-left corner)
 * @param {number} yPos Y position on screen (anchored to top-left corner)
 * @param {number} width Width of element
 * @param {number} height Height of element
 */
// TODO switch to centre-based positioning
function objectBoxCreator(xPos, yPos, width) {
  var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : width;
  var thisBox = {
    xPos: xPos,
    yPos: yPos,
    width: width,
    height: height
  };
  return _objectSpread({}, thisBox, {
    boundsCheck: function boundsCheck(childObject) {
      if (childObject.xPos < thisBox.xPos) {
        return false;
      }

      if (childObject.yPos < thisBox.yPos) {
        return false;
      }

      if (childObject.xPos + childObject.width > thisBox.xPos + thisBox.width) {
        return false;
      }

      if (childObject.yPos + childObject.height > thisBox.yPos + thisBox.height) {
        return false;
      }

      return true;
    },
    getRadius: function getRadius() {
      return thisBox.width / 2;
    }
  });
}

var _default = objectBoxCreator;
exports["default"] = _default;