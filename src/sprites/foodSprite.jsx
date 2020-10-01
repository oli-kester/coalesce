import React from 'react';
import PropTypes from 'prop-types';
import CircleSprite from './circleSprite';

function FoodSprite({ xPosStart, yPosStart, clock }) {
  const spriteData = CircleSprite(xPosStart, yPosStart, clock);

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

export default FoodSprite;
