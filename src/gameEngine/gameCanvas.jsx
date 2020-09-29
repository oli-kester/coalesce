import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from '../sprites/playerSprite';
import objectBoxCreator from './engine';

function GameCanvas({ clock }) {
  const [canvasBox] = useState(objectBoxCreator(5, 5, 490, 490));

  return (
    <div className="canvas">
      <PlayerSprite xPosStart={250} yPosStart={250} clock={clock} parentDims={canvasBox} />
      <h3>Clock counter</h3>
      <h3>{clock}</h3>
    </div>
  );
}

GameCanvas.propTypes = {
  clock: PropTypes.number.isRequired,
};

export default GameCanvas;
