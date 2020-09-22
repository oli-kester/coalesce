import React, { createContext } from 'react';
import GameCanvas from './GameCanvas';
import './styles/main.css';

// const COLOUR_SCHEME = {
//   'Mid Gray': '#364545',
//   'Dark Gray': '#101919',
//   'Deep Red': '#68121e',
//   White: '#f5f5f5',
//   'Bright Blue': '#44c5c5',
// };

export const ColourSchemeContext = createContext('test');

function Coalesce() {
  return (
    <ColourSchemeContext.Provider value="test">
      <h1>Coalesce</h1>
      <h2>Pure Reactive Joy.</h2>
      <GameCanvas />
    </ColourSchemeContext.Provider>
  );
}

export default Coalesce;
