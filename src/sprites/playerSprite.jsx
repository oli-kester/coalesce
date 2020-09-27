import React, { useContext, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ColourSchemeContext } from "../Coalesce";

const PLAYER_SPRITE_STARTING_RADIUS = 12;
const SPEED_FACTOR = 1;

// TODO breathing effects on player sprite

// TODO switch to internal, synced clock.

function PlayerSprite({ xPosStart, yPosStart, clock }) {
  const ColourScheme = useContext(ColourSchemeContext);

  const prevClockRef = useRef();
  useEffect(() => {
    prevClockRef.current = clock;
  });
  const prevClock = prevClockRef.current;

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
      case "ArrowUp":
        currMovementStatus.UP = true;
        console.log(`Setting yPos to ${yPos - 1}`);
        setYPos(yPos - 1);
        break;
      case "ArrowDown":
        currMovementStatus.DOWN = true;
        break;
      case "ArrowLeft":
        currMovementStatus.LEFT = true;
        break;
      case "ArrowRight":
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
      case "ArrowUp":
        currMovementStatus.UP = false;
        break;
      case "ArrowDown":
        currMovementStatus.DOWN = false;
        break;
      case "ArrowLeft":
        currMovementStatus.LEFT = false;
        break;
      case "ArrowRight":
        currMovementStatus.RIGHT = false;
        break;
      default:
        break;
    }

    setMovementStatus(currMovementStatus);
  }

  // move sprite
  // TODO figure out a way to stop this immediately re-executing
  if (movementStatus.UP && clock !== prevClock) {
    /// Don't update state here
  }

  return (
    <svg
      width="100%"
      height="100%"
      onKeyDown={keyDown}
      onKeyUp={keyUp}
      tabIndex={0}
    >
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
