import React from 'react';
import GameCanvas from './gameCanvas';
import './styles/main.css';

function Coalesce() {
  return (
    <div>
      <h1>Coalesce</h1>
      <h2>Pure Reactive Joy.</h2>
      <GameCanvas />
    </div>
  );
}

export default Coalesce;
