import React, { useState, useRef } from 'react';
import executeInstruction from './executeInstruction';

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
    // Get the latest code from the Monaco editor
    const updatedProgram = editor.getValue();  // This gets the current value of the editor
    setProgram(updatedProgram);  // Update the program state with the new content
  
    if (updatedProgram) {
      const results = simulateProgramExecution(updatedProgram);
      updateSVG(results);
      console.log('Updated svg Status:', results);
        // Send the results to the SVG
    }
  };
  
  const simulateProgramExecution = (program) => {
    const lines = program.split('\n');
    let data = {
      registers: Array(16).fill(0),  // s0 to sF
      leds: Array(16).fill(false),
      rgb: { r: false, g: false, b: false },
      pc: 0,
      stack: [],
      flags: { zero: false },  // Add flag to handle zero condition for comparisons
      carry: 0  // Carry flag
    };
  
    const results = lines.map((line) => {
      line = line.trim();
  
      // Parse instructions based on type
      if (line.startsWith('LOAD')) {
        const [, registerX, value] = line.split(' ');
        return executeInstruction({ type: 'LOAD', registerX, value: parseInt(value, 10) }, data);
      } else if (line.startsWith('ADD')) {
        const [, registerX, registerY] = line.split(' ');
        return executeInstruction({ type: 'ADD', registerX, registerY }, data);
      } else if (line.startsWith('SUB')) {
        const parts = line.split(' ');
        const registerX = parts[1];
        const secondOperand = parts[2];
        if (secondOperand.startsWith('s')) {
          return executeInstruction({ type: 'SUB', registerX, registerY: secondOperand }, data);
        } else {
          return executeInstruction({ type: 'SUB', registerX, value: parseInt(secondOperand, 10) }, data);
        }
      } else if (line.startsWith('OUTPUT')) {
        const [, port, value] = line.split(' ');
        return executeInstruction({ type: 'OUTPUT', port: parseInt(port, 10), value: parseInt(value, 10) }, data);
      } else if (line.startsWith('JUMP')) {
        const [, address] = line.split(' ');
        return executeInstruction({ type: 'JUMP', address: parseInt(address, 16) }, data);
      } else if (line.startsWith('CALL')) {
        const [, address] = line.split(' ');
        return executeInstruction({ type: 'CALL', address: parseInt(address, 16) }, data);
      } else if (line.startsWith('RETURN')) {
        console.log("Parsing RETURN instruction");
        return executeInstruction({ type: 'RETURN' }, data);
      } else if (line.startsWith('ADDCY')) {
        const [, registerX, registerY] = line.split(' ');
        return executeInstruction({ type: 'ADDCY', registerX, registerY }, data);
      } else if (line.startsWith('AND')) {
        const [, registerX, registerY] = line.split(' ');
        return executeInstruction({ type: 'AND', registerX, registerY }, data);
      } else if (line.startsWith('COMPARE')) {
        const [, registerX, registerY] = line.split(' ');
        return executeInstruction({ type: 'COMPARE', registerX, registerY }, data);
      }
      // Add other instructions here
      return null;
    }).filter(result => result !== null);
  
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
