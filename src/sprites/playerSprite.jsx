import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PLAYER_SPRITE_STARTING_RADIUS = 12;

// TODO breathing effects on player sprite

function PlayerSprite(props) {
  const { xPosStart, yPosStart } = props;

  const [xPos, setXPos] = useState(xPosStart);
  const [yPos, setYPos] = useState(yPosStart);
  const [radius, setRadius] = useState(PLAYER_SPRITE_STARTING_RADIUS);

  return (
    <svg width="100%" height="100%">
      <circle cx={xPos} cy={yPos} r={radius} fill="#44c5c5" />
    </svg>
  );
}

PlayerSprite.propTypes = {
  xPosStart: PropTypes.number.isRequired,
  yPosStart: PropTypes.number.isRequired,
};

export default PlayerSprite;
