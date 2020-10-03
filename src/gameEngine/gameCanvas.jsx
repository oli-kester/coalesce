import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from '../sprites/playerSprite';
import FoodSprite from '../sprites/foodSprite';
import RectObject, { SpawnRing } from './engine';
import CircleSprite from '../sprites/circleSprite';

// TODO make fully resizable

function GameCanvas({ clock }) {
  const CANVAS_SIZE = 500;
  const MARGIN_SIZE = 5;
  const [canvasBox] = useState(RectObject(
    MARGIN_SIZE, MARGIN_SIZE, CANVAS_SIZE - MARGIN_SIZE * 2, CANVAS_SIZE - MARGIN_SIZE * 2,
  ));
  const canvasStyle = { width: CANVAS_SIZE, height: CANVAS_SIZE };

  const BREATHING_ANIMATION_SPEED = 4;

  const PLAYER_SPRITE_STARTING_RADIUS = 12;
  const [playerSpriteData, setPlayerSpriteData] = useState({
    ...CircleSprite(CANVAS_SIZE / 2, CANVAS_SIZE / 2, PLAYER_SPRITE_STARTING_RADIUS),
    movementStatus: {
      UP: false,
      DOWN: false,
      LEFT: false,
      RIGHT: false,
    },
  });

  const SPAWN_INTERVAL = 500; // interval between spawns
  const [spawnRing] = useState(SpawnRing(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 4));
  const FOOD_SPRITE_STARTING_RADIUS = 9;
  const FOOD_SPRITE_MOVEMENT_SPEED = 0.004;
  const [foodSprites] = useState([]);

  const focusRef = useRef(null);

  function keyDown(event) {
    const newPlayerData = { ...playerSpriteData };
    switch (event.key) {
      case 'ArrowUp':
        newPlayerData.movementStatus.UP = true;
        break;
      case 'ArrowDown':
        newPlayerData.movementStatus.DOWN = true;
        break;
      case 'ArrowLeft':
        newPlayerData.movementStatus.LEFT = true;
        break;
      case 'ArrowRight':
        newPlayerData.movementStatus.RIGHT = true;
        break;
      default:
        break;
    }
    setPlayerSpriteData(newPlayerData);
  }

  function keyUp(event) {
    const newPlayerData = { ...playerSpriteData };
    switch (event.key) {
      case 'ArrowUp':
        newPlayerData.movementStatus.UP = false;
        break;
      case 'ArrowDown':
        newPlayerData.movementStatus.DOWN = false;
        break;
      case 'ArrowLeft':
        newPlayerData.movementStatus.LEFT = false;
        break;
      case 'ArrowRight':
        newPlayerData.movementStatus.RIGHT = false;
        break;
      default:
        break;
    }
    setPlayerSpriteData(newPlayerData);
  }

  // clock-triggered block
  useEffect(() => {
    // lock keyboard focus to player
    focusRef.current.focus();

    // spawn new sprites
    if (clock % SPAWN_INTERVAL === 0) {
      const coordinates = spawnRing.getRandomSpawnLocation();
      foodSprites.push(
        {
          ...CircleSprite(coordinates.xSpawn, coordinates.ySpawn, FOOD_SPRITE_STARTING_RADIUS),
          spriteMovementVector: {
            x: -((coordinates.xSpawn - CANVAS_SIZE / 2) * (FOOD_SPRITE_MOVEMENT_SPEED)),
            y: -((coordinates.ySpawn - CANVAS_SIZE / 2) * (FOOD_SPRITE_MOVEMENT_SPEED)),
          },
          key: clock,
        },
      );
    }

    // move player sprite
    const newPlayerData = { ...playerSpriteData };
    let changed = false;
    if (newPlayerData.movementStatus.UP) {
      newPlayerData.bounds.yPos -= 1;
      changed = true;
    }
    if (newPlayerData.movementStatus.DOWN) {
      newPlayerData.bounds.yPos += 1;
      changed = true;
    }
    if (newPlayerData.movementStatus.LEFT) {
      newPlayerData.bounds.xPos -= 1;
      changed = true;
    }
    if (newPlayerData.movementStatus.RIGHT) {
      newPlayerData.bounds.xPos += 1;
      changed = true;
    }
    if (changed && canvasBox.childCircleBoundsCheck(newPlayerData.bounds)) {
      setPlayerSpriteData(newPlayerData);
    }

    // breathing effect
    if (clock % BREATHING_ANIMATION_SPEED === 0) {
      playerSpriteData.breathe();
    }

    // move other sprites
    for (let i = 0; i < foodSprites.length; i += 1) {
      const currSprite = foodSprites[i];
      currSprite.bounds.xPos += currSprite.spriteMovementVector.x;
      currSprite.bounds.yPos += currSprite.spriteMovementVector.y;

      // breathing effect
      if (clock % BREATHING_ANIMATION_SPEED === 0) {
        currSprite.breathe();
      }
    }

    // TODO check for collisions
    for (let i = 0; i < foodSprites.length; i += 1) { break; }
  }, [clock]);

  return (
    <svg onKeyDown={keyDown} onKeyUp={keyUp} tabIndex={0} className="canvas" style={canvasStyle} ref={focusRef}>
      <PlayerSprite
        xPos={playerSpriteData.bounds.xPos}
        yPos={playerSpriteData.bounds.yPos}
        radius={playerSpriteData.animationState.radius}
        key={1}
      />
      {foodSprites.map((spriteParams) => (
        <FoodSprite
          xPos={spriteParams.bounds.xPos}
          yPos={spriteParams.bounds.yPos}
          radius={spriteParams.animationState.radius}
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
