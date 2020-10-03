const { CircleObject } = require('../gameEngine/engine');

function CircleSprite(xPos, yPos, radius) {
  const ANIMATION_STATES = { SHRINKING: 1, GROWING: 2 };
  const BREATHING_ANIMATION_MAGNITUDE = 0.15;

  const thisCircleSprite = {
    bounds: CircleObject(xPos, yPos, radius),
    animationState: {
      radius,
      status: ANIMATION_STATES.SHRINKING,
    },
  };

  return {
    ...thisCircleSprite,
    breathe: () => {
      const { bounds, animationState } = thisCircleSprite;
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
    },
  };
}

export default CircleSprite;
