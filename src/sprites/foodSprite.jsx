import React from 'react';
import PropTypes from 'prop-types';
import CircleSprite from './circleSprite';

function FoodSprite({ xPosStart, yPosStart, clock }) {
  const FOOD_SPRITE_STARTING_RADIUS = 9;
  const spriteData = CircleSprite(xPosStart, yPosStart, FOOD_SPRITE_STARTING_RADIUS, clock);

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
