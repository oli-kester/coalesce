import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CircleSprite from './circleSprite';

/**
 * User-controllable sprite
 * @param {*} props - Inputs are starting x and y position, and a clock signal.
 */
function PlayerSprite({
  xPosStart, yPosStart, clock, parentDims,
}) {
  const spriteData = CircleSprite(xPosStart, yPosStart, clock);

  const [movementStatus, setMovementStatus] = useState({
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  });

  function keyDown(event) {
    const currMovementStatus = { ...movementStatus };
    switch (event.key) {
      case 'ArrowUp':
        currMovementStatus.UP = true;
        break;
      case 'ArrowDown':
        currMovementStatus.DOWN = true;
        break;
      case 'ArrowLeft':
        currMovementStatus.LEFT = true;
        break;
      case 'ArrowRight':
        currMovementStatus.RIGHT = true;
        break;
      default:
        break;
    }
    setMovementStatus(currMovementStatus);
  }

  function keyUp(event) {
    const currMovementStatus = { ...movementStatus };
    switch (event.key) {
      case 'ArrowUp':
        currMovementStatus.UP = false;
        break;
      case 'ArrowDown':
        currMovementStatus.DOWN = false;
        break;
      case 'ArrowLeft':
        currMovementStatus.LEFT = false;
        break;
      case 'ArrowRight':
        currMovementStatus.RIGHT = false;
        break;
      default:
        break;
    }
    setMovementStatus(currMovementStatus);
  }

  // clock-triggered block
  useEffect(() => {
    // move sprite
    const newPlayerBounds = { ...spriteData.spriteBounds };
    let changed = false;
    if (movementStatus.UP) {
      newPlayerBounds.yPos = spriteData.spriteBounds.yPos - 1;
      changed = true;
    }
    if (movementStatus.DOWN) {
      newPlayerBounds.yPos = spriteData.spriteBounds.yPos + 1;
      changed = true;
    }
    if (movementStatus.LEFT) {
      newPlayerBounds.xPos = spriteData.spriteBounds.xPos - 1;
      changed = true;
    }
    if (movementStatus.RIGHT) {
      newPlayerBounds.xPos = spriteData.spriteBounds.xPos + 1;
      changed = true;
    }
    if (changed && parentDims.childCircleBoundsCheck(newPlayerBounds)) {
      spriteData.setSpriteBounds(newPlayerBounds);
    }
  }, [clock]);

  return (
    <svg width="100%" height="100%" onKeyDown={keyDown} onKeyUp={keyUp} tabIndex={0} className="sprite-window">
      <circle
        cx={spriteData.spriteBounds.xPos}
        cy={spriteData.spriteBounds.yPos}
        r={spriteData.animationState.radius}
        fill={spriteData.ColourScheme.White}
      />
    </svg>
  );
}

PlayerSprite.propTypes = {
  xPosStart: PropTypes.number.isRequired,
  yPosStart: PropTypes.number.isRequired,
  clock: PropTypes.number.isRequired,
  parentDims: PropTypes.shape({
    xPos: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    childCircleBoundsCheck: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlayerSprite;
