"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircleObject = CircleObject;
exports.SpawnRing = SpawnRing;
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Creates a new box-shaped object. If height is omitted, a square is created.
 * @param {number} xPos - X position on screen (anchored to top-left corner)
 * @param {number} yPos - Y position on screen (anchored to top-left corner)
 * @param {number} width - Width of element
 * @param {number} height - Height of element. Create a square by omitting this.
 */
function RectObject(xPos, yPos, width) {
  var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : width;
  var thisRect = {
    xPos: xPos,
    yPos: yPos,
    width: width,
    height: height
  };
  return _objectSpread({}, thisRect, {
    /**
     * This function checks if the given coordinates are valid for a child
     *  rectangle inside this one. Returns boolean.
     */
    childRectBoundsCheck: function childRectBoundsCheck(childObject) {
      if (childObject.xPos < thisRect.xPos) {
        return false;
      }

      if (childObject.yPos < thisRect.yPos) {
        return false;
      }

      if (childObject.xPos + childObject.width > thisRect.xPos + thisRect.width) {
        return false;
      }

      if (childObject.yPos + childObject.height > thisRect.yPos + thisRect.height) {
        return false;
      }

      return true;
    },

    /**
    * This function checks if the given coordinates are valid for a child
    *  circle inside this rectangle. Returns boolean.
    */
    childCircleBoundsCheck: function childCircleBoundsCheck(childObject) {
      if (childObject.xPos - childObject.radius < thisRect.xPos) {
        return false;
      }

      if (childObject.yPos - childObject.radius < thisRect.yPos) {
        return false;
      }

      if (childObject.xPos + childObject.radius > thisRect.xPos + thisRect.width) {
        return false;
      }

      if (childObject.yPos + childObject.radius > thisRect.yPos + thisRect.height) {
        return false;
      }

      return true;
    }
  });
}
/**
 * Creates a new circle-shaped object.
 * @param {number} xPos - X position on screen (anchored to center)
 * @param {number} yPos - Y position on screen (anchored to center)
 * @param {number} radius - Radius of element
 */


function CircleObject(xPos, yPos, radius) {
  var thisCircle = {
    xPos: xPos,
    yPos: yPos,
    radius: radius
  };
  return _objectSpread({}, thisCircle, {
    /**
     * Checks if the coordinates given for another circle will result
     * in a collision with this one. Returns boolean.
     */
    // TODO implement this
    collisionCheck: function collisionCheck(otherCircle) {}
  });
}
/**
 * An invisible ring that returns random points around its curcumference
 * for sprites to spawn along.
 * @param {*} xPos - X position on screen (anchored to center)
 * @param {*} yPos - Y position on screen (anchored to center)
 * @param {*} radius - Radius of ring
 */


function SpawnRing(xPos, yPos, radius) {
  var circle = CircleObject(xPos, yPos, radius);
  return _objectSpread({}, circle, {
    /**
     * Returns a random coordinate along the circle's circumference
     */
    getRandomSpawnLocation: function getRandomSpawnLocation() {
      var randomSeed = Math.random() * 2 * Math.PI;
      var xSpawn = xPos + radius * Math.cos(randomSeed);
      var ySpawn = yPos + radius * Math.sin(randomSeed);
      return {
        xSpawn: xSpawn,
        ySpawn: ySpawn
      };
    }
  });
}

var _default = RectObject;
exports["default"] = _default;