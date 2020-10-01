import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CircleSprite from './circleSprite';

function FoodSprite({
  xPosStart, yPosStart, clock, canvasSize
}) {
  const FOOD_SPRITE_STARTING_RADIUS = 9;
  const CANVAS_CENTRE = canvasSize / 2;
  const MOVEMENT_SPEED = 0.007;
  const MOVEMENT_VECTOR = {
    x: -((xPosStart - CANVAS_CENTRE) * (MOVEMENT_SPEED)),
    y: -((yPosStart - CANVAS_CENTRE) * (MOVEMENT_SPEED)),
  };
  const spriteData = CircleSprite(xPosStart, yPosStart, FOOD_SPRITE_STARTING_RADIUS, clock);

  // clock-triggered block
  useEffect(() => {
    // move sprite
    const newFoodBounds = { ...spriteData.spriteBounds };
    newFoodBounds.xPos = spriteData.spriteBounds.xPos + MOVEMENT_VECTOR.x;
    newFoodBounds.yPos = spriteData.spriteBounds.yPos + MOVEMENT_VECTOR.y;
    spriteData.setSpriteBounds(newFoodBounds);
  }, [clock]);

  return (
    <svg width="100%" height="100%" className="sprite-window">
      <circle
        cx={spriteData.spriteBounds.xPos}
        cy={spriteData.spriteBounds.yPos}
        r={spriteData.animationState.radius}
        fill={spriteData.ColourScheme['Bright Blue']}
      />
    </svg>
  );
}

FoodSprite.propTypes = {
  xPosStart: PropTypes.number.isRequired,
  yPosStart: PropTypes.number.isRequired,
  clock: PropTypes.number.isRequired,
};

export default FoodSprite;
