import React, {
  useContext, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { ColourSchemeContext } from '../coalesce';
import objectBoxCreator from '../gameEngine/engine';

/**
 * User-controllable sprite
 * @param {*} props - Inputs are starting x and y position, and a clock signal.
 */
function PlayerSprite({
  xPosStart, yPosStart, clock, parentDims,
}) {
  const PLAYER_SPRITE_STARTING_WIDTH = 24;
  const ANIMATION_STATES = {
    SHRINKING: 1,
    GROWING: 2,
  };
  const BREATHING_ANIMATION_MAGNITUDE = 0.15;
  const BREATHING_ANIMATION_SPEED = 4;

  const ColourScheme = useContext(ColourSchemeContext);

  const [playerBox, setPlayerBox] = useState(
    objectBoxCreator(
      xPosStart - (PLAYER_SPRITE_STARTING_WIDTH / 2),
      yPosStart - (PLAYER_SPRITE_STARTING_WIDTH / 2),
      PLAYER_SPRITE_STARTING_WIDTH,
    ),
  );
  const [animationState, setAnimationState] = useState({
    radius: PLAYER_SPRITE_STARTING_WIDTH / 2,
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
    const newPlayerBox = { ...playerBox };
    let changed = false;
    if (movementStatus.UP) {
      newPlayerBox.yPos = playerBox.yPos - 1;
      changed = true;
    }
    if (movementStatus.DOWN) {
      newPlayerBox.yPos = playerBox.yPos + 1;
      changed = true;
    }
    if (movementStatus.LEFT) {
      newPlayerBox.xPos = playerBox.xPos - 1;
      changed = true;
    }
    if (movementStatus.RIGHT) {
      newPlayerBox.xPos = playerBox.xPos + 1;
      changed = true;
    }
    if (changed && parentDims.boundsCheck(newPlayerBox)) {
      setPlayerBox(newPlayerBox);
    }

    // breathing effect
    if (clock % BREATHING_ANIMATION_SPEED === 0) {
      const newAnimationState = { ...animationState };

      if (animationState.status === ANIMATION_STATES.GROWING) {
        newAnimationState.radius = animationState.radius + 0.1;
      } else if (animationState.status === ANIMATION_STATES.SHRINKING) {
        newAnimationState.radius = animationState.radius - 0.1;
      }
      if (animationState.radius / playerBox.getRadius() > 1 + BREATHING_ANIMATION_MAGNITUDE) {
        newAnimationState.status = ANIMATION_STATES.SHRINKING;
      } else
        if (animationState.radius / playerBox.getRadius() < 1 - BREATHING_ANIMATION_MAGNITUDE) {
          newAnimationState.status = ANIMATION_STATES.GROWING;
        }

      setAnimationState(newAnimationState);
    }
  }, [clock]);

  return (
    <svg width="100%" height="100%" onKeyDown={keyDown} onKeyUp={keyUp} tabIndex={0}>
      <circle
        cx={playerBox.xPos + playerBox.getRadius()}
        cy={playerBox.yPos + playerBox.getRadius()}
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
    boundsCheck: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlayerSprite;
