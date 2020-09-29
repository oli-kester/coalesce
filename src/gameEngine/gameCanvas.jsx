import React from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from '../sprites/playerSprite';

function GameCanvas({ clock }) {
  return (
    <div className="canvas">
      <PlayerSprite xPosStart={250} yPosStart={250} clock={clock} />
      <h3>Clock counter</h3>
      <h3>{clock}</h3>
    </div>
  );
}

GameCanvas.propTypes = {
  clock: PropTypes.number.isRequired,
};

export default GameCanvas;
