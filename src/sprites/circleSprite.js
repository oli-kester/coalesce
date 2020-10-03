const { CircleObject } = require('../gameEngine/engine');

const ANIMATION_STATES = { SHRINKING: 1, GROWING: 2 };
const BREATHING_ANIMATION_MAGNITUDE = 0.15;

function CircleSprite(xPos, yPos, radius) {
  const thisCircleSprite = {
    bounds: CircleObject(xPos, yPos, radius),
    animationState: {
      radius,
      status: ANIMATION_STATES.SHRINKING,
    },
  };

  return {
    ...thisCircleSprite,
  };
}

export function breathe(circleSprite) {
  const newSpriteState = { ...circleSprite };
  const { bounds, animationState } = { ...circleSprite };
  if (animationState.status === ANIMATION_STATES.GROWING) {
    animationState.radius += 0.1;
  } else if (animationState.status === ANIMATION_STATES.SHRINKING) {
    animationState.radius -= 0.1;
  }
  if (animationState.radius / bounds.radius > 1 + BREATHING_ANIMATION_MAGNITUDE) {
    animationState.status = ANIMATION_STATES.SHRINKING;
  } else
    if (animationState.radius / bounds.radius
      < 1 - BREATHING_ANIMATION_MAGNITUDE) {
      animationState.status = ANIMATION_STATES.GROWING;
    }
    return newSpriteState;
}

export default CircleSprite;
