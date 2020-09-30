import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from '../sprites/playerSprite';
import RectObject from './engine';

function GameCanvas({ clock }) {
  const CANVAS_SIZE = 500;
  const MARGIN_SIZE = 5;
  const SPAWN_INTERVAL = 2000; // interval between spawns

  const [canvasBox] = useState(RectObject(
    MARGIN_SIZE, MARGIN_SIZE, CANVAS_SIZE - MARGIN_SIZE, CANVAS_SIZE - MARGIN_SIZE,
  ));
  const [foodSprites, setFoodSprites] = useState([]);

  // clock-triggered block
  useEffect(() => {
    if (clock % SPAWN_INTERVAL === 0) {
      foodSprites.push('');
    }
  });

  return (
    <div className="canvas">
      <PlayerSprite
        xPosStart={CANVAS_SIZE / 2}
        yPosStart={CANVAS_SIZE / 2}
        clock={clock}
        parentDims={canvasBox}
      />
      <h3>Clock counter</h3>
      <h3>{clock}</h3>
    </div>
  );
}

GameCanvas.propTypes = {
  clock: PropTypes.number.isRequired,
};

export default GameCanvas;
