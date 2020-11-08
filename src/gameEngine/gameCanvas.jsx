import React, {
  createContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import useDimensions from 'react-use-dimensions';
import PlayerSprite from '../sprites/playerSprite';
import NpcSprite from '../sprites/npcSprite';
import RectObject, { SpawnRing, collisionCheck } from './engine';
import CircleSprite, { breathe } from '../sprites/circleSprite';

const SPRITE_TYPES = { FOOD: 1, ENEMY: 2 };
export const SpriteTypesContext = createContext(SPRITE_TYPES);

function GameCanvas({ clock }) {
  // ----------------------------- GAME CONFIG -------------------------
  const DIFFICULTY_INCREASE_INTERVAL = 2000;
  const DIFFICULTY_INCREASE_FACTOR = 2; // must be a whole number

  // ----------------------------- CANVAS CONFIG -------------------------
  const [canvasRef, {
    // eslint-disable-next-line no-unused-vars
    x: _x, y: _y, width: canvasWidth, height: canvasHeight,
  }] = useDimensions();
  const CANVAS_STARTING_SIZE = 500;
  const MARGIN_SIZE = 5;
  const [canvasBounds, setCanvasBounds] = useState(RectObject(
    MARGIN_SIZE, MARGIN_SIZE, CANVAS_STARTING_SIZE - MARGIN_SIZE * 2,
    CANVAS_STARTING_SIZE - MARGIN_SIZE * 2,
  ));

  // ----------------------------- SPRITE CONFIG -------------------------
  const BREATHING_ANIMATION_SPEED = 4;

  // PLAYER  -------------------------
  const PLAYER_SPRITE_STARTING_RADIUS = 12;
  const PLAYER_SPRITE_GROWTH_RATE = 3;
  const [playerMovementSpeed, setPlayerMovementSpeed] = useState(1);
  const [playerSpriteData, setPlayerSpriteData] = useState({
    ...CircleSprite(CANVAS_STARTING_SIZE / 2,
      CANVAS_STARTING_SIZE / 2, PLAYER_SPRITE_STARTING_RADIUS),
  });
  const [playerMovementStatus, setPlayerMovementStatus] = useState({
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  });

  // NPCS  -------------------------
  const [npcSprites] = useState([]);
  const [spawnRing, setSpawnRing] = useState(SpawnRing(CANVAS_STARTING_SIZE / 2,
    CANVAS_STARTING_SIZE / 2, CANVAS_STARTING_SIZE / 1.5));
  const [spriteDeleteBox, setSpriteDeleteBox] = useState(RectObject(-400, -400,
    CANVAS_STARTING_SIZE + 800, CANVAS_STARTING_SIZE + 800));
  const NPC_BASE_RADIUS = 6;
  const NPC_RADIUS_RANDOMNESS = 1.5;
  const NPC_VECTOR_RANDOMNESS = 0.5;
  const [npcSpawnInterval, setNpcSpawnInterval] = useState(500);
  const [npcMovementSpeed, setNpcMovementSpeed] = useState(0.001);
  const [spriteTypeSkew, setSpriteTypeSkew] = useState(0.1);

  // --------------------------- KEYBOARD HANDLERS  ----------------------
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

  // ----------------------------- VISUAL LOGIC -------------------------
  // sync canvas dimensions - triggered by resizing window
  useEffect(() => {
    setCanvasBounds(RectObject(MARGIN_SIZE, MARGIN_SIZE, canvasWidth - MARGIN_SIZE * 2,
      canvasHeight - MARGIN_SIZE * 2));
    setSpawnRing(SpawnRing(canvasWidth / 2,
      canvasHeight / 2, canvasWidth / 1.5));
    setSpriteDeleteBox(RectObject(-400, -400,
      canvasWidth + 800, canvasHeight + 800));

    // reset player to middle when resizing window
    const newPlayerData = { ...playerSpriteData };
    const newPlayerBounds = { ...playerSpriteData.bounds };
    newPlayerBounds.xPos = canvasWidth / 2;
    newPlayerBounds.yPos = canvasHeight / 2;
    newPlayerData.bounds = newPlayerBounds;
    setPlayerSpriteData(newPlayerData);
  }, [canvasWidth, canvasHeight]);

  // clock-triggered block
  useEffect(() => {
    // lock keyboard focus to player
    if (canvasRef.current !== undefined) {
      canvasRef.current.focus();
    }

    // spawn new sprites
    if (clock % npcSpawnInterval === 0) {
      // use default canvas width if we can't yet measure the DOM
      const npcCanvasWidth = (canvasWidth === undefined) ? CANVAS_STARTING_SIZE : canvasWidth;
      const npcCanvasHeight = (canvasHeight === undefined) ? CANVAS_STARTING_SIZE : canvasHeight;

      const coordinates = spawnRing.getRandomSpawnLocation();
      const npcSizeFactor = (Math.random() + 0.6) * NPC_RADIUS_RANDOMNESS;
      const npcVectorFactor = (Math.random() - 0.5) * (npcCanvasWidth * NPC_VECTOR_RANDOMNESS);
      const npcPathX = coordinates.xSpawn - npcCanvasWidth / 2 + npcVectorFactor;
      const npcPathY = coordinates.ySpawn - npcCanvasHeight / 2 + npcVectorFactor;
      const spriteType = Math.round(Math.random() + spriteTypeSkew);
      npcSprites.push(
        {
          ...CircleSprite(coordinates.xSpawn, coordinates.ySpawn,
            NPC_BASE_RADIUS * npcSizeFactor),
          spriteMovementVector: {
            x: -(npcPathX * npcMovementSpeed),
            y: -(npcPathY * npcMovementSpeed),
          },
          type: spriteType,
          key: clock,
        },
      );
    }

    // move player sprite
    const newPlayerBounds = { ...playerSpriteData.bounds };
    let changed = false;
    if (playerMovementStatus.UP) {
      newPlayerBounds.yPos -= playerMovementSpeed;
      changed = true;
    }
    if (playerMovementStatus.DOWN) {
      newPlayerBounds.yPos += playerMovementSpeed;
      changed = true;
    }
    if (playerMovementStatus.LEFT) {
      newPlayerBounds.xPos -= playerMovementSpeed;
      changed = true;
    }
    if (playerMovementStatus.RIGHT) {
      newPlayerBounds.xPos += playerMovementSpeed;
      changed = true;
    }
    if (changed && canvasBounds.childCircleBoundsCheck(newPlayerBounds)) {
      const newPlayerData = { ...playerSpriteData };
      newPlayerData.bounds = newPlayerBounds;
      setPlayerSpriteData(newPlayerData);
    }

    // breathing effect
    if (clock % BREATHING_ANIMATION_SPEED === 0) {
      setPlayerSpriteData(breathe(playerSpriteData));
    }

    // move other sprites
    for (let i = 0; i < npcSprites.length; i += 1) {
      let currSprite = npcSprites[i];
      currSprite.bounds.xPos += currSprite.spriteMovementVector.x;
      currSprite.bounds.yPos += currSprite.spriteMovementVector.y;

      // breathing effect
      if (clock % BREATHING_ANIMATION_SPEED === 0) {
        currSprite = breathe(currSprite);
      }
    }

    for (let i = 0; i < npcSprites.length; i += 1) {
      const currSprite = npcSprites[i];

      // delete sprites that are outside deletion bounds
      if (!spriteDeleteBox.childCircleBoundsCheck(currSprite.bounds)) {
        npcSprites.splice(i, 1);
        i -= 1;

        // check for collisions
        // TODO - make this work based on animation size
      } else if (collisionCheck(playerSpriteData.bounds, currSprite.bounds)) {
        const newPlayerSpriteData = { ...playerSpriteData };
        if (currSprite.type === SPRITE_TYPES.FOOD) {
          newPlayerSpriteData.bounds.radius += PLAYER_SPRITE_GROWTH_RATE;
        } else {
          // TODO game over when sprite size is zero
          newPlayerSpriteData.bounds.radius -= PLAYER_SPRITE_GROWTH_RATE;
        }
        newPlayerSpriteData.animationState.radius = newPlayerSpriteData.bounds.radius - 1;
        setPlayerSpriteData(newPlayerSpriteData);
        npcSprites.splice(i, 1);
        i -= 1;
      }
    }

    // at set intervals, increase game difficulty.
    if (clock !== 0 && clock % DIFFICULTY_INCREASE_INTERVAL === 0) {
      const incrementFactor = 1 + DIFFICULTY_INCREASE_FACTOR / 10;
      const decrementFactor = 1 - DIFFICULTY_INCREASE_FACTOR / 6;

      setNpcSpawnInterval(Math.round(npcSpawnInterval * decrementFactor));
      setNpcMovementSpeed(npcMovementSpeed * incrementFactor);
      setPlayerMovementSpeed(playerMovementSpeed * incrementFactor);
      setSpriteTypeSkew(spriteTypeSkew * incrementFactor);
    }
  }, [clock]);

  // ----------------------------- RENDERING -------------------------
  return (
    <svg onKeyDown={keyDown} onKeyUp={keyUp} tabIndex={0} className="canvas" ref={canvasRef}>
      <PlayerSprite
        xPos={playerSpriteData.bounds.xPos}
        yPos={playerSpriteData.bounds.yPos}
        radius={playerSpriteData.animationState.radius}
        key={1}
      />
      <SpriteTypesContext.Provider value={SPRITE_TYPES}>
        {npcSprites.map((spriteParams) => (
          <NpcSprite
            xPos={spriteParams.bounds.xPos}
            yPos={spriteParams.bounds.yPos}
            radius={spriteParams.animationState.radius}
            type={spriteParams.type}
            key={spriteParams.key}
          />
        ))}
      </SpriteTypesContext.Provider>
    </svg>
  );
}

GameCanvas.propTypes = {
  clock: PropTypes.number.isRequired,
};

export default GameCanvas;
