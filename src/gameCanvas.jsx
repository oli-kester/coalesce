import React from 'react';
import PlayerSprite from './sprites/playerSprite';

function GameCanvas() {
  return (
    <div className="canvas">
      <PlayerSprite xPosStart="250" yPosStart="250" />
    </div>
  );
}

export default GameCanvas;
