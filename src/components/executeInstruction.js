function executeInstruction(instruction, data) {
    const opcode = instruction.type;
  
    switch (opcode) {
      case 'LOAD':
        data[instruction.registerX] = instruction.value;
        break;
  
      case 'ADD':
        if (instruction.registerY) {
          data[instruction.registerX] = (data[instruction.registerX] || 0) + (data[instruction.registerY] || 0);
        } else {
          data[instruction.registerX] = (data[instruction.registerX] || 0) + instruction.value;
        }
        break;
  
      case 'ADDCY':
        if (instruction.registerY) {
          data[instruction.registerX] = (data[instruction.registerX] || 0) + (data[instruction.registerY] || 0) + (data.carry || 0);
        } else {
          data[instruction.registerX] = (data[instruction.registerX] || 0) + instruction.value + (data.carry || 0);
        }
        break;
  
      case 'SUB':
        if (instruction.registerY) {
          data[instruction.registerX] = (data[instruction.registerX] || 0) - (data[instruction.registerY] || 0);
        } else {
          data[instruction.registerX] = (data[instruction.registerX] || 0) - instruction.value;
        }
        break;
  
      case 'SUBCY':
        if (instruction.registerY) {
          data[instruction.registerX] = (data[instruction.registerX] || 0) - (data[instruction.registerY] || 0) - (data.carry || 0);
        } else {
          data[instruction.registerX] = (data[instruction.registerX] || 0) - instruction.value - (data.carry || 0);
        }
        break;
  
      case 'AND':
        if (instruction.registerY) {
          data[instruction.registerX] = (data[instruction.registerX] || 0) & (data[instruction.registerY] || 0);
        } else {
          data[instruction.registerX] = (data[instruction.registerX] || 0) & instruction.value;
        }
        break;
  
      case 'OR':
        if (instruction.registerY) {
          data[instruction.registerX] = (data[instruction.registerX] || 0) | (data[instruction.registerY] || 0);
        } else {
          data[instruction.registerX] = (data[instruction.registerX] || 0) | instruction.value;
        }
        break;
  
      case 'XOR':
        if (instruction.registerY) {
          data[instruction.registerX] = (data[instruction.registerX] || 0) ^ (data[instruction.registerY] || 0);
        } else {
          data[instruction.registerX] = (data[instruction.registerX] || 0) ^ instruction.value;
        }
        break;
  
      case 'COMPARE':
        if (instruction.registerY) {
          data.zeroFlag = (data[instruction.registerX] === data[instruction.registerY]);
        } else {
          data.zeroFlag = (data[instruction.registerX] === instruction.value);
        }
        break;
  
      case 'OUTPUT':
        if (instruction.port === 0) {
          data.leds[instruction.value] = true;
        } else if (instruction.port === 1) {
          const rgbValue = instruction.value;
          data.rgb = {
            r: rgbValue & 0b001 ? true : false,
            g: rgbValue & 0b010 ? true : false,
            b: rgbValue & 0b100 ? true : false,
          };
        }
        break;
  
      case 'JUMP':
        data.pc = instruction.address;
        break;
  
      case 'JUMPZ':
        if (data.zeroFlag) {
          data.pc = instruction.address;
        }
        break;
  
      case 'JUMPNZ':
        if (!data.zeroFlag) {
          data.pc = instruction.address;
        }
        break;
  
      case 'CALL':
        data.stack.push(data.pc); // Save the current program counter on the stack
        data.pc = instruction.address;
        break;
  
      case 'CALLZ':
        if (data.zeroFlag) {
          data.stack.push(data.pc);
          data.pc = instruction.address;
        }
        break;
  
      case 'CALLNZ':
        if (!data.zeroFlag) {
          data.stack.push(data.pc);
          data.pc = instruction.address;
        }
        break;
  
      case 'RETURN':
        data.pc = data.stack.pop(); // Pop the return address from the stack
        break;
  
      case 'DISABLE':
        data.interruptsEnabled = false;
        break;
  
      case 'ENABLE':
        data.interruptsEnabled = true;
        break;
  
      case 'RL': // Rotate Left
        data[instruction.registerX] = ((data[instruction.registerX] || 0) << 1) | ((data[instruction.registerX] & 0x80) ? 1 : 0);
        break;
  
      case 'RR': // Rotate Right
        data[instruction.registerX] = ((data[instruction.registerX] || 0) >> 1) | ((data[instruction.registerX] & 1) ? 0x80 : 0);
        break;
  
      case 'SLA': // Shift Left Arithmetic
        data[instruction.registerX] = (data[instruction.registerX] || 0) << 1;
        break;
  
      case 'SRA': // Shift Right Arithmetic
        data[instruction.registerX] = (data[instruction.registerX] || 0) >> 1;
        break;
  
      case 'FETCH':
        // Implement the FETCH logic (if relevant to your simulator)
        break;
  
      // Handle more instructions as needed...
  
      default:
        console.warn(`Unknown instruction: ${opcode}`);
        break;
    }
  
    return { ...data }; // Return the updated data
  }
  
  export default executeInstruction;
  