import React from 'react';
import GameCanvas from './GameCanvas';
import './styles/main.css';

const COLOUR_SCHEME = {
  'Mid Gray': '#364545',
  'Dark Gray': '#101919',
  'Deep Red': '#68121e',
  White: '#f5f5f5',
  'Bright Blue': '#44c5c5',
};

const ColourSchemeContext = React.createContext(COLOUR_SCHEME);

function Coalesce() {
  return (
    <ColourSchemeContext.Provider value={COLOUR_SCHEME}>
      <h1>Coalesce</h1>
      <h2>Pure Reactive Joy.</h2>
      <GameCanvas />
    </ColourSchemeContext.Provider>
  );
}

export default Coalesce;
