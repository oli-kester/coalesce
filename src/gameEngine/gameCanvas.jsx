import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from '../sprites/playerSprite';
import FoodSprite from '../sprites/foodSprite';
import RectObject, { SpawnRing, collisionCheck } from './engine';
import CircleSprite, { breathe } from '../sprites/circleSprite';

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
  const PLAYER_SPRITE_GROWTH_RATE = 3;
  const [playerSpriteData, setPlayerSpriteData] = useState({
    ...CircleSprite(CANVAS_SIZE / 2, CANVAS_SIZE / 2, PLAYER_SPRITE_STARTING_RADIUS),
  });
  const [playerMovementStatus, setPlayerMovementStatus] = useState({
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  });

  const SPAWN_INTERVAL = 500; // interval between spawns
  const [spawnRing] = useState(SpawnRing(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 1.5));
  const [spriteDeleteBox] = useState(RectObject(-400, -400, CANVAS_SIZE + 800, CANVAS_SIZE + 800));
  const FOOD_SPRITE_STARTING_RADIUS = 9;
  const FOOD_SPRITE_MOVEMENT_SPEED = 0.002;
  const [foodSprites] = useState([]);

  const focusRef = useRef(null);

  function keyDown(event) {
    const newMovementStatus = { ...playerMovementStatus };
    switch (event.key) {
      case 'ArrowUp':
        newMovementStatus.UP = true;
        break;
      case 'ArrowDown':
        newMovementStatus.DOWN = true;
        break;
      case 'ArrowLeft':
        newMovementStatus.LEFT = true;
        break;
      case 'ArrowRight':
        newMovementStatus.RIGHT = true;
        break;
      default:
        break;
    }
    setPlayerMovementStatus(newMovementStatus);
  }

  function keyUp(event) {
    const newMovementStatus = { ...playerMovementStatus };
    switch (event.key) {
      case 'ArrowUp':
        newMovementStatus.UP = false;
        break;
      case 'ArrowDown':
        newMovementStatus.DOWN = false;
        break;
      case 'ArrowLeft':
        newMovementStatus.LEFT = false;
        break;
      case 'ArrowRight':
        newMovementStatus.RIGHT = false;
        break;
      default:
        break;
    }
    setPlayerMovementStatus(newMovementStatus);
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
    const newPlayerBounds = { ...playerSpriteData.bounds };
    let changed = false;
    if (playerMovementStatus.UP) {
      newPlayerBounds.yPos -= 1;
      changed = true;
    }
    if (playerMovementStatus.DOWN) {
      newPlayerBounds.yPos += 1;
      changed = true;
    }
    if (playerMovementStatus.LEFT) {
      newPlayerBounds.xPos -= 1;
      changed = true;
    }
    if (playerMovementStatus.RIGHT) {
      newPlayerBounds.xPos += 1;
      changed = true;
    }
    if (changed && canvasBox.childCircleBoundsCheck(newPlayerBounds)) {
      const newPlayerData = { ...playerSpriteData };
      newPlayerData.bounds = newPlayerBounds;
      setPlayerSpriteData(newPlayerData);
    }

    // breathing effect
    if (clock % BREATHING_ANIMATION_SPEED === 0) {
      setPlayerSpriteData(breathe(playerSpriteData));
    }

    // move other sprites
    for (let i = 0; i < foodSprites.length; i += 1) {
      let currSprite = foodSprites[i];
      currSprite.bounds.xPos += currSprite.spriteMovementVector.x;
      currSprite.bounds.yPos += currSprite.spriteMovementVector.y;

      // breathing effect
      if (clock % BREATHING_ANIMATION_SPEED === 0) {
        currSprite = breathe(currSprite);
      }
    }

    for (let i = 0; i < foodSprites.length; i += 1) {
      const currSprite = foodSprites[i];

      // delete sprites that are outside deletion bounds
      if (!spriteDeleteBox.childCircleBoundsCheck(currSprite.bounds)) {
        foodSprites.splice(i, 1);
        i -= 1;

        // check for collisions
        // TODO - make this work based on animation size
      } else if (collisionCheck(playerSpriteData.bounds, currSprite.bounds)) {
        const newPlayerSpriteData = { ...playerSpriteData };
        newPlayerSpriteData.bounds.radius += PLAYER_SPRITE_GROWTH_RATE;
        newPlayerSpriteData.animationState.radius = newPlayerSpriteData.bounds.radius - 1;
        setPlayerSpriteData(newPlayerSpriteData);
        foodSprites.splice(i, 1);
        i -= 1;
      }
    }
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
