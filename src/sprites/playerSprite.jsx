import React, {
  useContext, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { ColourSchemeContext } from '../coalesce';

function elementBounds(xPos, yPos, width, height) {
  return {
    xPos, yPos, width, height,
  };
}

/**
 * Used to check if a proposed sprite position will be valid inside of a container.
 * All dimensions are assumed rectangular.
 * Positions are calculated from top-left
 * @param {*} container - The dimensions / position of the container
 * @param {*} object - The dimensions / position of the object
 * @returns boolean - Whether or not the object's position is valid
 */
function boundsCheck(container, object) {
  if (object.xPos < container.xPos) { return false; }
  if (object.yPos < container.yPos) { return false; }
  if (object.xPos + object.width > container.xPos + container.width) { return false; }
  if (object.yPos + object.height > container.yPos + container.height) { return false; }
  return true;
}

/**
 * User-controllable sprite
 * @param {*} props - Inputs are starting x and y position, and a clock signal.
 */
function PlayerSprite({ xPosStart, yPosStart, clock }) {
  const PLAYER_SPRITE_STARTING_RADIUS = 12;
  const ANIMATION_STATES = {
    SHRINKING: 1,
    GROWING: 2,
  };
  const BREATHING_ANIMATION_MAGNITUTE = 0.15;
  const BREATHING_ANIMATION_SPEED = 4;

  const ColourScheme = useContext(ColourSchemeContext);

  const [xPos, setXPos] = useState(xPosStart);
  const [yPos, setYPos] = useState(yPosStart);
  const [baseRadius, setBaseRadius] = useState(PLAYER_SPRITE_STARTING_RADIUS);
  const [animationState, setAnimationState] = useState({
    radius: PLAYER_SPRITE_STARTING_RADIUS,
    status: ANIMATION_STATES.SHRINKING,
  });
  const [movementStatus, setMovementStatus] = useState({
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  });

  function keyDown(event) {
    const currMovementStatus = movementStatus;
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
    const currMovementStatus = movementStatus;
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
    if (movementStatus.UP) {
      setYPos(yPos - 1);
    }
    if (movementStatus.DOWN) {
      setYPos(yPos + 1);
    }
    if (movementStatus.LEFT) {
      setXPos(xPos - 1);
    }
    if (movementStatus.RIGHT) {
      setXPos(xPos + 1);
    }

    // breathing effect
    if (clock % BREATHING_ANIMATION_SPEED === 0) {
      const newAnimationState = animationState;

      if (animationState.status === ANIMATION_STATES.GROWING) {
        newAnimationState.radius = animationState.radius + 0.1;
      } else if (animationState.status === ANIMATION_STATES.SHRINKING) {
        newAnimationState.radius = animationState.radius - 0.1;
      }

      if (animationState.radius / baseRadius > 1 + BREATHING_ANIMATION_MAGNITUTE) {
        newAnimationState.status = ANIMATION_STATES.SHRINKING;
      } else if (animationState.radius / baseRadius < 1 - BREATHING_ANIMATION_MAGNITUTE) {
        newAnimationState.status = ANIMATION_STATES.GROWING;
      }

      setAnimationState(newAnimationState);
    }
  }, [clock]);

  return (
    <svg width="100%" height="100%" onKeyDown={keyDown} onKeyUp={keyUp} tabIndex={0}>
      <circle cx={xPos} cy={yPos} r={animationState.radius} fill={ColourScheme.White} />
    </svg>
  );
}

PlayerSprite.propTypes = {
  xPosStart: PropTypes.number.isRequired,
  yPosStart: PropTypes.number.isRequired,
  clock: PropTypes.number.isRequired,
};

export default PlayerSprite;
