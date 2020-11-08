import React from 'react';
import PropTypes from 'prop-types';

function EndDialog({
  resetGame, displayEndDialog, setDisplayEndDialog, clock,
}) {
  function reset() {
    resetGame();
    setDisplayEndDialog(false);
  }

  return (
    <div className={`splash-screen ${displayEndDialog ? 'show' : 'hide'}`}>
      <h2>Game Over </h2>
      <div className="dialog-details">
        <h3>You died </h3>
        <p>
          {`You scored ${clock} points.`}
        </p>
      </div>
      <button onClick={reset} type="button" className="button" disabled={!displayEndDialog}>Reset</button>
    </div>
  );
}
EndDialog.propTypes = {
  resetGame: PropTypes.func.isRequired,
  displayEndDialog: PropTypes.bool.isRequired,
  setDisplayEndDialog: PropTypes.func.isRequired,
  clock: PropTypes.number.isRequired,
};

export default EndDialog;
