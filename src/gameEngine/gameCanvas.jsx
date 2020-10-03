import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from '../sprites/playerSprite';
import FoodSprite from '../sprites/foodSprite';
import RectObject, { SpawnRing } from './engine';

function GameCanvas({ clock }) {
  const CANVAS_SIZE = 500;
  const MARGIN_SIZE = 5;
  const SPAWN_INTERVAL = 500; // interval between spawns

  const FOOD_SPRITE_STARTING_RADIUS = 9;
  const FOOD_SPRITE_MOVEMENT_SPEED = 0.007;

  const [canvasBox] = useState(RectObject(
    MARGIN_SIZE, MARGIN_SIZE, CANVAS_SIZE - MARGIN_SIZE * 2, CANVAS_SIZE - MARGIN_SIZE * 2,
  ));
  const [spawnRing] = useState(SpawnRing(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 4));
  const [foodSprites] = useState([]);

  const canvasStyle = { width: CANVAS_SIZE, height: CANVAS_SIZE };

  // clock-triggered block
  useEffect(() => {
    // spawn new sprites
    if (clock % SPAWN_INTERVAL === 0) {
      const coordinates = spawnRing.getRandomSpawnLocation();
      foodSprites.push(
        {
          xPos: coordinates.xSpawn,
          yPos: coordinates.ySpawn,
          radius: FOOD_SPRITE_STARTING_RADIUS,
          spriteMovementVector: {
            x: -((coordinates.xSpawn - CANVAS_SIZE / 2) * (FOOD_SPRITE_MOVEMENT_SPEED)),
            y: -((coordinates.ySpawn - CANVAS_SIZE / 2) * (FOOD_SPRITE_MOVEMENT_SPEED)),
          },
          clock,
        },
      );
    }

    // move player sprite

    // move other sprites
    for (let i = 0; i < foodSprites.length; i += 1) {
      foodSprites[i].xPos += foodSprites[i].spriteMovementVector.x;
      foodSprites[i].yPos += foodSprites[i].spriteMovementVector.y;
    }

    // check for collisions
    for (let i = 0; i < foodSprites.length; i += 1) {

    }
  }, [clock]);

  return (
    <svg className="canvas" style={canvasStyle}>
      <PlayerSprite
        xPosStart={CANVAS_SIZE / 2}
        yPosStart={CANVAS_SIZE / 2}
        clock={clock}
        parentDims={canvasBox}
        key={1}
      />
      {foodSprites.map((spriteParams) => (
        <FoodSprite
          xPos={spriteParams.xPos}
          yPos={spriteParams.yPos}
          radius={spriteParams.radius}
          clock={clock}
          key={spriteParams.key}
        />
      ))}
    </svg>
  );
}

GameCanvas.propTypes = {
  clock: PropTypes.number.isRequired,
};

export default GameCanvas;
