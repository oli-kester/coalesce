import {
  useContext, useState, useEffect,
} from 'react';
import { ColourSchemeContext } from '../coalesce';
import { CircleObject } from '../gameEngine/engine';

/**
 * Interface for creating new circular sprites. Does not draw on screen - data only.
 * @param {number} xPosStart - X position on screen (anchored to center)
 * @param {number} yPosStart - Y position on screen (anchored to center)
 * @param {number} clock - Clock signal
 * @returns {object} Returns an object containing spriteBounds,
 * setSpriteBounds, animationState & ColourScheme.
 */
function CircleSprite(xPosStart, yPosStart, clock) {
  const SPRITE_STARTING_RADIUS = 12;
  const ANIMATION_STATES = {
    SHRINKING: 1,
    GROWING: 2,
  };
  const BREATHING_ANIMATION_MAGNITUDE = 0.15;
  const BREATHING_ANIMATION_SPEED = 4;

  const ColourScheme = useContext(ColourSchemeContext);

  const [spriteBounds, setSpriteBounds] = useState(
    CircleObject(xPosStart, yPosStart, SPRITE_STARTING_RADIUS),
  );
  const [animationState, setAnimationState] = useState({
    radius: SPRITE_STARTING_RADIUS,
    status: ANIMATION_STATES.SHRINKING,
  });

  useEffect(() => {
    // breathing effect
    if (clock % BREATHING_ANIMATION_SPEED === 0) {
      const newAnimationState = { ...animationState };

      if (animationState.status === ANIMATION_STATES.GROWING) {
        newAnimationState.radius = animationState.radius + 0.1;
      } else if (animationState.status === ANIMATION_STATES.SHRINKING) {
        newAnimationState.radius = animationState.radius - 0.1;
      }
      if (animationState.radius / spriteBounds.radius > 1 + BREATHING_ANIMATION_MAGNITUDE) {
        newAnimationState.status = ANIMATION_STATES.SHRINKING;
      } else
        if (animationState.radius / spriteBounds.radius < 1 - BREATHING_ANIMATION_MAGNITUDE) {
          newAnimationState.status = ANIMATION_STATES.GROWING;
        }
      setAnimationState(newAnimationState);
    }
  }, [clock]);

  return {
    spriteBounds,
    setSpriteBounds,
    animationState,
    ColourScheme,
  };
}

export default CircleSprite;
