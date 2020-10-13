import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ColourSchemeContext } from '../coalesce';

/**
 * User-controllable sprite
 * @param {*} props - Inputs are starting x and y position, and a clock signal.
 */
function PlayerSprite({
  xPos, yPos, radius,
}) {
  const ColourScheme = useContext(ColourSchemeContext);

  return (
    // TODO make multiple circles over time
    <circle
      cx={xPos}
      cy={yPos}
      r={radius}
      fill={ColourScheme.White}
      className="player"
    />
  );
}

PlayerSprite.propTypes = {
  xPos: PropTypes.number.isRequired,
  yPos: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
};

export default PlayerSprite;
