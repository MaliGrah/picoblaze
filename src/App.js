import React, { useState, useCallback, useRef } from 'react';
import Editor from './components/Editor';
import NexysA7 from './components/NexysA7';
import ControlMenu from './components/ControlMenu';
import './App.css';

function App() {
  const [editor, setEditor] = useState(null);
  const nexysA7Ref = useRef(null);

  const handleEditorMount = useCallback((editorInstance) => {
    setEditor(editorInstance);
  }, []);

  const updateSVG = (results) => {
    if (nexysA7Ref.current) {
      nexysA7Ref.current.updateDisplay(results);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PicoBlaze Simulator</h1>
      </header>
      <ControlMenu editor={editor} updateSVG={updateSVG} nexysA7Ref={nexysA7Ref} />
      <div className="content">
        <Editor onMount={handleEditorMount} />
        <NexysA7 ref={nexysA7Ref} />
      </div>
    </div>
  );
}

export default App;
