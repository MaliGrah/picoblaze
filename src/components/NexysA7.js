import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import NexysA7SVG from '../assets/nexys-a7.svg';


const NexysA7 = forwardRef((props, ref) => {
  const [ledStatus, setLedStatus] = useState(Array(16).fill('black')); // Storing the actual fill color
  const [rgbStatus, setRgbStatus] = useState({ r: 'black', g: 'black', b: 'black' });
  const [buttonStatus, setButtonStatus] = useState(Array(5).fill(false));  // Button states

  useEffect(() => {
    console.log('Received data in useEffect:', props.data);
    if (props.data) {
      requestAnimationFrame(() => {
        const newLedStatus = Array(16).fill('black');
        let newRgbStatus = { r: 'black', g: 'black', b: 'black' };
  
        props.data.forEach((entry) => {
          if (entry.type === 'led') {
            newLedStatus[entry.index] = entry.state ? 'red' : 'black';
            console.log(`LED ${entry.index + 1}: state is ${entry.state}, fillColor is now ${newLedStatus[entry.index]}`);
          } else if (entry.type === 'rgb') {
            newRgbStatus.r = entry.state.r ? 'red' : 'black';
            newRgbStatus.g = entry.state.g ? 'green' : 'black';
            newRgbStatus.b = entry.state.b ? 'blue' : 'black';
          }
        });
  
        setLedStatus(newLedStatus);
        setRgbStatus(newRgbStatus);
      });
    }
  }, [props.data]);
  

  useImperativeHandle(ref, () => ({
    updateDisplay(data) {
      const newLedStatus = Array(16).fill('black');
      let newRgbStatus = { r: 'black', g: 'black', b: 'black' };
      const newButtonStatus = Array(5).fill(false);

      data.forEach((entry) => {
        if (entry.type === 'led') {
          newLedStatus[entry.index] = entry.state ? 'red' : 'black';
        } else if (entry.type === 'rgb') {
          newRgbStatus.r = entry.state.r ? 'red' : 'black';
          newRgbStatus.g = entry.state.g ? 'green' : 'black';
          newRgbStatus.b = entry.state.b ? 'blue' : 'black';
        } else if (entry.type === 'button') {
          newButtonStatus[entry.index] = entry.state;
        }
      });

      setLedStatus(newLedStatus);
      setRgbStatus(newRgbStatus);
      setButtonStatus(newButtonStatus);
    }
  }));

  const toggleButton = (index) => {
    const newStatus = [...buttonStatus];
    newStatus[index] = !newStatus[index];
    setButtonStatus(newStatus);
    console.log(`Button ${index + 1} pressed. New status: ${newStatus[index]}`);
    props.onButtonPress && props.onButtonPress(index, newStatus[index]);
  };

  const handleLedClick = (index) => {
    const newLedStatus = [...ledStatus];
    newLedStatus[index] = newLedStatus[index] === 'red' ? 'black' : 'red';
    setLedStatus(newLedStatus);
    console.log(`LED ${index + 1} toggled. New status: ${newLedStatus[index]}`);
  };

  const handleRgbClick = (color) => {
    const newRgbStatus = { r: rgbStatus.r, g: rgbStatus.g, b: rgbStatus.b };
    newRgbStatus[color] = newRgbStatus[color] === color ? 'black' : color;
    setRgbStatus(newRgbStatus);
    console.log(`RGB ${color} toggled. New status: ${newRgbStatus[color]}`);
  };

  return (
    <div>
      <h2>Nexys A7 Board</h2>
      <div>
        <svg width="800" height="600">
          <image href={NexysA7SVG} width="800" height="600" />
          {ledStatus.map((fillColor, index) => (
            <circle 
              key={index} 
              cx={50 + (index % 8) * 50} 
              cy={400 + Math.floor(index / 8) * 50} 
              r="15" 
              fill={fillColor}  // Use fillColor directly to set the color
              onClick={() => handleLedClick(index)} // Add click handler for LEDs
            />
          ))}
          <circle 
            cx="600" 
            cy="150" 
            r="15" 
            fill={rgbStatus.r} 
            onClick={() => handleRgbClick('r')} // Add click handler for RGB red
          />
          <circle 
            cx="600" 
            cy="200" 
            r="15" 
            fill={rgbStatus.g} 
            onClick={() => handleRgbClick('g')} // Add click handler for RGB green
          />
          <circle 
            cx="600" 
            cy="250" 
            r="15" 
            fill={rgbStatus.b} 
            onClick={() => handleRgbClick('b')} // Add click handler for RGB blue
          />

          {/* Button Rectangles */}
          <rect x="505" y="380" width="40" height="40" fill={buttonStatus[0] ? 'green' : 'gray'} onClick={() => toggleButton(0)} />
          <rect x="505" y="480" width="40" height="40" fill={buttonStatus[1] ? 'green' : 'gray'} onClick={() => toggleButton(1)} />
          <rect x="555" y="430" width="40" height="40" fill={buttonStatus[2] ? 'green' : 'gray'} onClick={() => toggleButton(2)} />
          <rect x="455" y="430" width="40" height="40" fill={buttonStatus[3] ? 'green' : 'gray'} onClick={() => toggleButton(3)} />
          <rect x="505" y="430" width="40" height="40" fill={buttonStatus[4] ? 'green' : 'gray'} onClick={() => toggleButton(4)} />
        </svg>
      </div>
      <div>
        <h3>LED Status:</h3>
        {ledStatus.map((status, index) => (
          <div key={index}>LED {index + 1}: {status === 'red' ? 'On' : 'Off'}</div>
        ))}
        <h3>RGB LED Status:</h3>
        <div>Red: {rgbStatus.r === 'red' ? 'On' : 'Off'}</div>
        <div>Green: {rgbStatus.g === 'green' ? 'On' : 'Off'}</div>
        <div>Blue: {rgbStatus.b === 'blue' ? 'On' : 'Off'}</div>
        <h3>Button Status:</h3>
        {buttonStatus.map((status, index) => (
          <div key={index}>Button {index + 1}: {status ? 'Pressed' : 'Released'}</div>
        ))}
      </div>
    </div>
  );
});

export default NexysA7;
