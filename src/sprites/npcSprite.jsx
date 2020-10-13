import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ColourSchemeContext } from '../coalesce';
import { SpriteTypesContext } from '../gameEngine/gameCanvas';

function NpcSprite({
  xPos, yPos, radius, type,
}) {
  const ColourScheme = useContext(ColourSchemeContext);
  const SPRITE_TYPES = useContext(SpriteTypesContext);
  const foodStyle = ColourScheme['Bright Blue'];
  const enemyStyle = ColourScheme['Deep Red'];

  return (
    <circle
      cx={xPos}
      cy={yPos}
      r={radius}
      fill={type === SPRITE_TYPES.FOOD ? foodStyle : enemyStyle}
      // TODO different colour shadows based on type
      className="npc"
    />
  );
}

NpcSprite.propTypes = {
  xPos: PropTypes.number.isRequired,
  yPos: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
};

export default NpcSprite;
