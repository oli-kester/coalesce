import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ColourSchemeContext } from '../coalesce';

function FoodSprite({
  xPos, yPos, radius,
}) {
  const ColourScheme = useContext(ColourSchemeContext);

  return (
    <circle
      cx={xPos}
      cy={yPos}
      r={radius}
      fill={ColourScheme['Bright Blue']}
    />
  );
}

FoodSprite.propTypes = {
  xPos: PropTypes.number.isRequired,
  yPos: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
};

export default FoodSprite;
