import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import NexysA7SVG from '../assets/nexys-a7.svg';



const NexysA7 = forwardRef((props, ref) => {
  const [ledStatus, setLedStatus] = useState(Array(16).fill(false));
  const [rgbStatus, setRgbStatus] = useState({ r: false, g: false, b: false });
  const [buttonStatus, setButtonStatus] = useState(Array(5).fill(false)); // For 5 buttons

  useEffect(() => {
    if (props.data) {
      // Use requestAnimationFrame for efficient updates
      requestAnimationFrame(() => {
        console.log('Props data received:', props.data);
        const newLedStatus = Array(16).fill(false);
        let newRgbStatus = { r: false, g: false, b: false };

        props.data.forEach((entry) => {
          if (entry.type === 'led') {
            newLedStatus[entry.index] = entry.state;
          } else if (entry.type === 'rgb') {
            newRgbStatus = { ...newRgbStatus, ...entry.state };
          }
        });

        setLedStatus(newLedStatus);
        setRgbStatus(newRgbStatus);
      });
    }
  }, [props.data]);

  useImperativeHandle(ref, () => ({
    updateDisplay(data) {
      console.log("updateDisplay called with data:", data);
      if (data) {
        const newLedStatus = Array(16).fill(false);
        let newRgbStatus = { r: false, g: false, b: false };

        data.forEach((entry) => {
          if (entry.type === 'led') {
            newLedStatus[entry.index] = entry.state;
          } else if (entry.type === 'rgb') {
            newRgbStatus = { ...newRgbStatus, ...entry.state };
          }
        });

        setLedStatus(newLedStatus);
        setRgbStatus(newRgbStatus);
      }
    }
  }));

  const toggleLed = (index) => {
    const newStatus = [...ledStatus];
    newStatus[index] = !newStatus[index];
    setLedStatus(newStatus);
  };

  const toggleRgb = (color) => {
    const newStatus = { ...rgbStatus, [color]: !rgbStatus[color] };
    setRgbStatus(newStatus);
  };

  const toggleButton = (index) => {
    const newStatus = [...buttonStatus];
    newStatus[index] = !newStatus[index];
    setButtonStatus(newStatus);
  };

  // LED positions (arranged in a grid-like fashion for simplicity)
  const ledPositions = Array.from({ length: 16 }, (_, index) => ({
    cx: 50 + (index % 8) * 50,
    cy: 400 + Math.floor(index / 8) * 50,
  }));

  // Button positions in a plus formation
  const buttonPositions = {
    north: { cx: 525, cy: 400 },
    south: { cx: 525, cy: 500 },
    east: { cx: 575, cy: 450 },
    west: { cx: 475, cy: 450 },
    center: { cx: 525, cy: 450 }
  };

  const getLedStyle = (index) => ({
    fill: ledStatus[index] ? 'red' : 'black',
  });

  const getRgbStyle = () => {
    let fillColor = 'black';
    if (rgbStatus.r || rgbStatus.g || rgbStatus.b) {
      fillColor = `rgb(${rgbStatus.r ? 255 : 0}, ${rgbStatus.g ? 255 : 0}, ${rgbStatus.b ? 255 : 0})`;
    }
    return { fill: fillColor };
  };

  const getButtonStyle = (index) => ({
    fill: buttonStatus[index] ? 'green' : 'gray',
  });

  return (
    <div>
      <h2>Nexys A7 Board</h2>
      <div>
        <svg width="800" height="600">
          <image href={NexysA7SVG} width="800" height="600" />
          
          {/* Render LED circles based on positions */}
          {ledPositions.map((pos, index) => (
            <circle
              key={index}
              cx={pos.cx}
              cy={pos.cy}
              r={15}
              style={getLedStyle(index)}
              onClick={() => toggleLed(index)}
            />
          ))}

          {/* Render RGB LED */}
          <circle cx={600} cy={150} r={15} style={getRgbStyle()} onClick={() => toggleRgb('r')} />
          <circle cx={600} cy={200} r={15} style={getRgbStyle()} onClick={() => toggleRgb('g')} />
          <circle cx={600} cy={250} r={15} style={getRgbStyle()} onClick={() => toggleRgb('b')} />

          {/* Render Button rectangles based on positions */}
          {Object.keys(buttonPositions).map((position, index) => (
            <rect
              key={position}
              x={buttonPositions[position].cx - 20}
              y={buttonPositions[position].cy - 20}
              width={40}
              height={40}
              fill="gray"
              stroke="black"
              strokeWidth={2}
              style={getButtonStyle(index)}
              onClick={() => toggleButton(index)}
            />
          ))}
        </svg>
      </div>
      <div>
        <h3>LED Status:</h3>
        {ledStatus.map((status, index) => (
          <div key={index}>LED {index + 1}: {status ? 'On' : 'Off'}</div>
        ))}
        <h3>RGB LED Status:</h3>
        <div>Red: {rgbStatus.r ? 'On' : 'Off'}</div>
        <div>Green: {rgbStatus.g ? 'On' : 'Off'}</div>
        <div>Blue: {rgbStatus.b ? 'On' : 'Off'}</div>
        <h3>Button Status:</h3>
        {buttonStatus.map((status, index) => (
          <div key={index}>Button {index + 1}: {status ? 'Pressed' : 'Released'}</div>
        ))}
      </div>
    </div>
  );
});

export default NexysA7;
