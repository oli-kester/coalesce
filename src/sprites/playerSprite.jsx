import React, {
  useContext, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { ColourSchemeContext } from '../coalesce';
import { CircleObject } from '../gameEngine/engine';

/**
 * User-controllable sprite
 * @param {*} props - Inputs are starting x and y position, and a clock signal.
 */
function PlayerSprite({
  xPosStart, yPosStart, clock, parentDims,
}) {
  const PLAYER_SPRITE_STARTING_RADIUS = 12;
  const ANIMATION_STATES = {
    SHRINKING: 1,
    GROWING: 2,
  };
  const BREATHING_ANIMATION_MAGNITUDE = 0.15;
  const BREATHING_ANIMATION_SPEED = 4;

  const ColourScheme = useContext(ColourSchemeContext);

  const [playerBounds, setPlayerBounds] = useState(
    CircleObject(xPosStart, yPosStart, PLAYER_SPRITE_STARTING_RADIUS),
  );
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
    const newPlayerBounds = { ...playerBounds };
    let changed = false;
    if (movementStatus.UP) {
      newPlayerBounds.yPos = playerBounds.yPos - 1;
      changed = true;
    }
    if (movementStatus.DOWN) {
      newPlayerBounds.yPos = playerBounds.yPos + 1;
      changed = true;
    }
    if (movementStatus.LEFT) {
      newPlayerBounds.xPos = playerBounds.xPos - 1;
      changed = true;
    }
    if (movementStatus.RIGHT) {
      newPlayerBounds.xPos = playerBounds.xPos + 1;
      changed = true;
    }
    if (changed && parentDims.childCircleBoundsCheck(newPlayerBounds)) {
      setPlayerBounds(newPlayerBounds);
    }

    // breathing effect
    if (clock % BREATHING_ANIMATION_SPEED === 0) {
      const newAnimationState = { ...animationState };

      if (animationState.status === ANIMATION_STATES.GROWING) {
        newAnimationState.radius = animationState.radius + 0.1;
      } else if (animationState.status === ANIMATION_STATES.SHRINKING) {
        newAnimationState.radius = animationState.radius - 0.1;
      }
      if (animationState.radius / playerBounds.radius > 1 + BREATHING_ANIMATION_MAGNITUDE) {
        newAnimationState.status = ANIMATION_STATES.SHRINKING;
      } else
        if (animationState.radius / playerBounds.radius < 1 - BREATHING_ANIMATION_MAGNITUDE) {
          newAnimationState.status = ANIMATION_STATES.GROWING;
        }

      setAnimationState(newAnimationState);
    }
  }, [clock]);

  return (
    <svg width="100%" height="100%" onKeyDown={keyDown} onKeyUp={keyUp} tabIndex={0}>
      <circle
        cx={playerBounds.xPos}
        cy={playerBounds.yPos}
        r={animationState.radius}
        fill={ColourScheme.White}
      />
    </svg>
  );
}

PlayerSprite.propTypes = {
  xPosStart: PropTypes.number.isRequired,
  yPosStart: PropTypes.number.isRequired,
  clock: PropTypes.number.isRequired,
  // TODO move this type checking inside the functional component
  parentDims: PropTypes.shape({
    xPos: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    childCircleBoundsCheck: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlayerSprite;
