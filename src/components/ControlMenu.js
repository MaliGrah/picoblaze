import React, { useState, useRef } from 'react';

const ControlMenu = ({ editor, updateSVG, nexysA7Ref }) => {
  const [program, setProgram] = useState('');
  const fileInputRef = useRef(null);

  const newProgram = () => {
    setProgram('');
    if (editor) {
      editor.setValue('');
    }
  };

  const loadProgram = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const programContent = e.target.result;
      setProgram(programContent);
      if (editor) {
        editor.setValue(programContent);
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const saveProgram = () => {
    const element = document.createElement('a');
    const file = new Blob([program], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'program.kc';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const runProgram = () => {
    if (program) {
      const results = simulateProgramExecution(program);
      updateSVG(results);
    }
  };

  const simulateProgramExecution = (program) => {
    const lines = program.split('\n');
    const results = lines.map((line, index) => {
      const ledIndex = index % 16; // Adjust LED index based on your logic
      const isOn = line.includes('LED on'); // Example condition

      if (line.includes('[error]')) {
        return { type: 'error', message: `Processed error line: ${line}` };
      } else if (line.includes('[info]')) {
        return { type: 'info', message: `Processed info line: ${line}` };
      } else {
        return { type: 'led', index: ledIndex, state: isOn };
      }
    });
    return results;
  };

  return (
    <div>
      <button onClick={newProgram}>New Program</button>
      <button onClick={triggerFileInput}>Load Program</button>
      <input
        type="file"
        accept=".kc,.txt"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={loadProgram}
      />
      <button onClick={saveProgram}>Save Program</button>
      <button onClick={runProgram}>Run</button>
    </div>
  );
};

export default ControlMenu;
