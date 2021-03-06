import React, {
  createContext, useCallback, useEffect, useState,
} from 'react';
import GameCanvas from './gameEngine/gameCanvas';
import './styles/main.css';

const COLOUR_SCHEME = {
  'Mid Gray': '#364545',
  'Dark Gray': '#101919',
  'Deep Red': '#68121e',
  White: '#f5f5f5',
  'Bright Blue': '#44c5c5',
};

export const ColourSchemeContext = createContext(COLOUR_SCHEME);

function Coalesce() {
  const UPDATE_INTERVAL = 4.17; // this is 240Hz in ms.

  const [clock, setClock] = useState(0);
  const [clockActive, setClockActive] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleClockActive = useCallback(() => {
    setClockActive(!clockActive);
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetClock = useCallback(() => {
    setClock(0);
    setClockActive(true);
  });

  useEffect(() => {
    let timer;
    if (clockActive) {
      timer = setInterval(() => {
        setClock(clock + 1);
      }, UPDATE_INTERVAL);
    }
    return () => {
      clearInterval(timer);
    };
  });

  // TODO add about section

  return (
    <ColourSchemeContext.Provider value={COLOUR_SCHEME}>
      <div className="main-container">
        <div className="title-bar">
          <h1>Coalesce</h1>
          <h2 className="tagline">Pure Reactive Play.</h2>
        </div>
        <GameCanvas clock={clock} toggleClockActive={toggleClockActive} resetClock={resetClock} />
        <div className="bottom-bar">
          <p>Made in 2020 by Oliver Reynolds. </p>
        </div>
      </div>
    </ColourSchemeContext.Provider>
  );
}

export default Coalesce;
