import React from "react";
import PropTypes from "prop-types";
import PlayerSprite from "./sprites/playerSprite";

function GameCanvas({}) {
  const clock = Date.now();
  return (
    <div className="canvas">
      <PlayerSprite xPosStart={250} yPosStart={250} clock={clock} />
      <h2>Clock count (ms) -{clock}</h2>
    </div>
  );
}

GameCanvas.propTypes = {
  clock: PropTypes.number.isRequired,
};

export default GameCanvas;
