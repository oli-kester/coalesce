import React, {
  createContext, useEffect, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import PlayerSprite from '../sprites/playerSprite';
import NpcSprite from '../sprites/npcSprite';
import RectObject, { SpawnRing, collisionCheck } from './engine';
import CircleSprite, { breathe } from '../sprites/circleSprite';

// TODO make fully resizable

const SPRITE_TYPES = { FOOD: 1, ENEMY: 2 };
export const SpriteTypesContext = createContext(SPRITE_TYPES);

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
  const [playerMovementSpeed, setPlayerMovementSpeed] = useState(1);
  const [playerSpriteData, setPlayerSpriteData] = useState({
    ...CircleSprite(CANVAS_SIZE / 2, CANVAS_SIZE / 2, PLAYER_SPRITE_STARTING_RADIUS),
  });
  const [playerMovementStatus, setPlayerMovementStatus] = useState({
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  });

  const [npcSprites] = useState([]);
  const [spawnRing] = useState(SpawnRing(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 1.5));
  const [spriteDeleteBox] = useState(RectObject(-400, -400, CANVAS_SIZE + 800, CANVAS_SIZE + 800));
  const NPC_BASE_RADIUS = 6;
  const NPC_RADIUS_RANDOMNESS = 1.5;
  const NPC_VECTOR_RANDOMNESS = 0.5;
  const [npcSpawnInterval, setNpcSpawnInterval] = useState(500);
  const [npcMovementSpeed, setNpcMovementSpeed] = useState(0.002);
  const [spriteTypeSkew, setSpriteTypeSkew] = useState(0.1);

  const DIFFICULTY_INCREASE_INTERVAL = 2000;
  const DIFFICULTY_INCREASE_FACTOR = 2;

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
    if (clock % npcSpawnInterval === 0) {
      const coordinates = spawnRing.getRandomSpawnLocation();
      const npcSizeFactor = (Math.random() + 0.6) * NPC_RADIUS_RANDOMNESS;
      const npcVectorFactor = (Math.random() - 0.5) * (CANVAS_SIZE * NPC_VECTOR_RANDOMNESS);
      const npcPathX = coordinates.xSpawn - CANVAS_SIZE / 2 + npcVectorFactor;
      const npcPathY = coordinates.ySpawn - CANVAS_SIZE / 2 + npcVectorFactor;
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
    if (clock % DIFFICULTY_INCREASE_INTERVAL === 0) {
      setNpcSpawnInterval(npcSpawnInterval / DIFFICULTY_INCREASE_FACTOR);
      setNpcMovementSpeed(npcMovementSpeed * DIFFICULTY_INCREASE_FACTOR);
      setPlayerMovementSpeed(playerMovementSpeed * DIFFICULTY_INCREASE_FACTOR);
      setSpriteTypeSkew(spriteTypeSkew * DIFFICULTY_INCREASE_FACTOR);
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
