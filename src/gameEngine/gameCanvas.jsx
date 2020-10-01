import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from '../sprites/playerSprite';
import FoodSprite from '../sprites/foodSprite';
import RectObject, { SpawnRing } from './engine';

function GameCanvas({ clock }) {
  const CANVAS_SIZE = 500;
  const MARGIN_SIZE = 5;
  const SPAWN_INTERVAL = 500; // interval between spawns

  const [canvasBox] = useState(RectObject(
    MARGIN_SIZE, MARGIN_SIZE, CANVAS_SIZE - MARGIN_SIZE * 2, CANVAS_SIZE - MARGIN_SIZE * 2,
  ));
  const [spawnRing] = useState(SpawnRing(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 4));
  const [foodSprites] = useState([]);

  const canvasStyle = { width: CANVAS_SIZE, height: CANVAS_SIZE };

  // clock-triggered block
  useEffect(() => {
    if (clock % SPAWN_INTERVAL === 0) {
      const coordinates = spawnRing.getRandomSpawnLocation();
      foodSprites.push(
        <FoodSprite
          xPosStart={coordinates.xSpawn}
          yPosStart={coordinates.ySpawn}
          clock={clock}
        />,
      );
    }
  });

  return (
    <div className="canvas" style={canvasStyle}>
      <PlayerSprite
        xPosStart={CANVAS_SIZE / 2}
        yPosStart={CANVAS_SIZE / 2}
        clock={clock}
        parentDims={canvasBox}
      />
      {foodSprites[0]}
    </div>
  );
}

GameCanvas.propTypes = {
  clock: PropTypes.number.isRequired,
};

export default GameCanvas;
