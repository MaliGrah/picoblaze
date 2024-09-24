import React, { useState, useRef } from 'react';

const ControlMenu = ({ editor, updateSVG }) => {
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
      updateSVG(results); // Send the results to the SVG
    }
  };

  const simulateProgramExecution = (program) => {
    const lines = program.split('\n');
    const results = lines.map((line) => {
      const ledCommandMatch = line.match(/LED(\d+)\s+(on|off)/i); // Match "LEDx on" or "LEDx off"
      if (ledCommandMatch) {
        const ledNumber = parseInt(ledCommandMatch[1], 10); // Extract the LED number
        const isOn = ledCommandMatch[2].toLowerCase() === 'on'; // Determine the state
        return { type: 'led', index: ledNumber - 1, state: isOn }; // Adjust for 0-indexed array
      }
      // Add more command handling as needed (e.g., RGB control)
      return null;
    }).filter(result => result !== null); // Filter out null entries
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
