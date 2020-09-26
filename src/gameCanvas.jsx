import React from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from './sprites/PlayerSprite';

function GameCanvas({ clock }) {
  return (
    <div className="canvas">
      <PlayerSprite xPosStart={250} yPosStart={250} clock={clock} />
      <h2>{clock}</h2>
    </div>
  );
}

GameCanvas.propTypes = {
  clock: PropTypes.number.isRequired,
};

export default GameCanvas;
