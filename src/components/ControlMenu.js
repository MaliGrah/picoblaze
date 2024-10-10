import React, { useState, useRef } from 'react';
import executeInstruction from './executeInstruction';  // Make sure the path is correct

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
    const results = [];
    let data = { leds: Array(16).fill(false), rgb: { r: false, g: false, b: false }, pc: 0, stack: [] };

    lines.forEach((line) => {
      line = line.trim();

      // Parse the program based on the instruction type
      if (line.startsWith('LOAD')) {
        const [, registerX, value] = line.split(' ');
        results.push(executeInstruction({ type: 'LOAD', registerX, value: parseInt(value, 10) }, data));
      } else if (line.startsWith('ADD')) {
        const [, registerX, registerY] = line.split(' ');
        results.push(executeInstruction({ type: 'ADD', registerX, registerY }, data));
      } else if (line.startsWith('SUB')) {
        const [, registerX, registerY] = line.split(' ');
        results.push(executeInstruction({ type: 'SUB', registerX, registerY }, data)); // Added SUB instruction
      } else if (line.startsWith('OUTPUT')) {
        const [, port, value] = line.split(' ');
        results.push(executeInstruction({ type: 'OUTPUT', port: parseInt(port, 10), value: parseInt(value, 10) }, data));
      } else if (line.startsWith('JUMP')) {
        const [, address] = line.split(' ');
        results.push(executeInstruction({ type: 'JUMP', address: parseInt(address, 16) }, data));
      } else if (line.startsWith('CALL')) {
        const [, address] = line.split(' ');
        results.push(executeInstruction({ type: 'CALL', address: parseInt(address, 16) }, data));
      } else if (line.startsWith('RETURN')) {
        results.push(executeInstruction({ type: 'RETURN' }, data));
      }
      // Add other instructions here like SUB, AND, OR, etc.
      // You can follow the similar pattern as for ADD, LOAD, etc.
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
