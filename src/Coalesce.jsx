import React, { createContext, useEffect, useState } from 'react';
import GameCanvas from './GameCanvas';
import './styles/main.css';

const COLOUR_SCHEME = {
  'Mid Gray': '#364545',
  'Dark Gray': '#101919',
  'Deep Red': '#68121e',
  White: '#f5f5f5',
  'Bright Blue': '#44c5c5',
};

const UPDATE_INTERVAL = 4.17; // this is 240Hz in ms.

export const ColourSchemeContext = createContext(COLOUR_SCHEME);

function Coalesce() {
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now(), UPDATE_INTERVAL));

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <ColourSchemeContext.Provider value={COLOUR_SCHEME}>
      <h1>Coalesce</h1>
      <h2>Pure Reactive Joy.</h2>
      <GameCanvas clock={clock} />
    </ColourSchemeContext.Provider>
  );
}

export default Coalesce;
