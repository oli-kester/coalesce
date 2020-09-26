import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ColourSchemeContext } from '../Coalesce';

const PLAYER_SPRITE_STARTING_RADIUS = 12;

// TODO breathing effects on player sprite

function PlayerSprite({ xPosStart, yPosStart, clock }) {
  const ColourScheme = useContext(ColourSchemeContext);

  const [xPos, setXPos] = useState(xPosStart);
  const [yPos, setYPos] = useState(yPosStart);
  const [radius, setRadius] = useState(PLAYER_SPRITE_STARTING_RADIUS);
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

  return (
    <svg width="100%" height="100%" onKeyDown={keyDown} onKeyUp={keyUp}>
      <circle cx={xPos} cy={yPos} r={radius} fill={ColourScheme.White} />
    </svg>
  );
}

PlayerSprite.propTypes = {
  xPosStart: PropTypes.number.isRequired,
  yPosStart: PropTypes.number.isRequired,
  clock: PropTypes.number.isRequired,
};

export default PlayerSprite;
