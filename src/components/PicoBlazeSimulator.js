import React, { useRef } from 'react';
import NexysA7 from './NexysA7';
import executeInstruction from './executeInstruction';

function PicoBlazeSimulator() {
  const nexysRef = useRef(null);
  const data = {
    registers: {},   // Initialize register values
    leds: Array(16).fill(false),  // 16 LEDs, all off initially
    rgb: { r: false, g: false, b: false },  // RGB LED state
    stack: [],       // Stack for calls/returns
    pc: 0,           // Program counter starts at 0
  };

  const instructions = [
    { type: 'LOAD', registerX: 's0', value: 5 },  // Example instructions
    { type: 'ADD', registerX: 's0', registerY: 's1' },
    { type: 'OUTPUT', port: 0, value: 0 }, // Turn on LED 1
    { type: 'OUTPUT', port: 1, value: 1 }, // Turn on RGB Red
    { type: 'JUMP', address: 2 } // Jump back to instruction 2
  ];

  const runPicoBlaze = () => {
    let step = 0;
    
    const interval = setInterval(() => {
      if (step >= instructions.length) {
        clearInterval(interval);
        return;
      }

      // Execute the current instruction and update the data
      const currentInstruction = instructions[data.pc];
      const updatedData = executeInstruction(currentInstruction, data);

      // Call the NexysA7's updateDisplay method to update the visual state
      nexysRef.current.updateDisplay([
        { type: 'led', index: 0, state: updatedData.leds[0] },
        { type: 'rgb', state: updatedData.rgb }
      ]);

      // Move to the next step or follow jumps
      data.pc = (updatedData.pc !== undefined) ? updatedData.pc : step + 1;
      step++;
    }, 1000);  // Execute each instruction every second
  };

  return (
    <div>
      <button onClick={runPicoBlaze}>Run Simulation</button>
      <NexysA7 ref={nexysRef} />
    </div>
  );
}

export default PicoBlazeSimulator;
