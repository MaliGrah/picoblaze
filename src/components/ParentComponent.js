import React, { useState } from 'react';
import NexysA7 from './NexysA7';

const ParentComponent = () => {
  const [boardData, setBoardData] = useState([
    ...Array(16).fill().map((_, index) => ({ type: 'led', index, state: false })),
    { type: 'rgb', state: { r: false, g: false, b: false } },
  ]);

  const updateBoardState = () => {
    setBoardData([
      { type: 'led', index: 0, state: false },
      { type: 'led', index: 1, state: false },
      { type: 'led', index: 2, state: false },
      ...Array(13).fill().map((_, i) => ({ type: 'led', index: i + 3, state: false })),
      { type: 'rgb', state: { r: false, g: false, b: false } }
    ]);
  };
  console.log('Board data:', boardData);
  return (
    <div>
      
      <NexysA7 data={boardData} />
      <button onClick={updateBoardState}>Update Board</button>
    </div>
  );
};

export default ParentComponent;