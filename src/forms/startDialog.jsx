import React, { useState } from 'react';
import PropTypes from 'prop-types';

function StartDialog({ toggleClockActive }) {
  const [displayStartDialog, setDisplayStartDialog] = useState(true);

  function start() {
    toggleClockActive();
    setDisplayStartDialog(false);
  }

  return (
    <div className={`splash-screen ${displayStartDialog ? 'show' : 'hide'}`}>
      <h2>Welcome to Coalesce. </h2>
      <ul className="dialog-details">
        <li><span>Use the arrow keys to move. </span></li>
        <li><span>Eat the blue nodes - they are food. </span></li>
        <li><span>Avoid the red nodes - they are enemies. </span></li>
        <li>
          <span>See how long you can last. It&apos;s survival of the fittest out here! </span>
        </li>
      </ul>
      <button onClick={start} type="button" className="button" disabled={!displayStartDialog}>Start</button>
    </div>
  );
}
StartDialog.propTypes = {
  toggleClockActive: PropTypes.func.isRequired,
};

export default StartDialog;
