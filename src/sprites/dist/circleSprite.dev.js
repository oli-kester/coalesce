"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../gameEngine/engine'),
    CircleObject = _require.CircleObject;

function CircleSprite(xPos, yPos, radius) {
  var ANIMATION_STATES = {
    SHRINKING: 1,
    GROWING: 2
  };
  var BREATHING_ANIMATION_MAGNITUDE = 0.15;
  var thisCircleSprite = {
    bounds: CircleObject(xPos, yPos, radius),
    animationState: {
      radius: radius,
      status: ANIMATION_STATES.SHRINKING
    }
  };
  return _objectSpread({}, thisCircleSprite, {
    breathe: function breathe() {
      var bounds = thisCircleSprite.bounds,
          animationState = thisCircleSprite.animationState;

      if (animationState.status === ANIMATION_STATES.GROWING) {
        animationState.radius += 0.1;
      } else if (animationState.status === ANIMATION_STATES.SHRINKING) {
        animationState.radius -= 0.1;
      }

      if (animationState.radius / bounds.radius > 1 + BREATHING_ANIMATION_MAGNITUDE) {
        animationState.status = ANIMATION_STATES.SHRINKING;
      } else if (animationState.radius / bounds.radius < 1 - BREATHING_ANIMATION_MAGNITUDE) {
        animationState.status = ANIMATION_STATES.GROWING;
      }
    }
  });
}

var _default = CircleSprite;
exports["default"] = _default;