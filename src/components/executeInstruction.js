const executeInstruction = (instruction, data) => {
  const registers = data.registers || Array(16).fill(0);  // Initialize registers s0 to sF (16 registers)

  const getRegisterIndex = (register) => parseInt(register.slice(1), 16);
  
  switch (instruction.type) {
    case 'LOAD':
      const loadValue = parseInt(instruction.value, 10);
      if (!isNaN(loadValue)) {
        registers[getRegisterIndex(instruction.registerX)] = loadValue;
        console.log(`Registers after LOAD:`, registers);
      }
      break;

    case 'ADD':
      registers[getRegisterIndex(instruction.registerX)] += registers[getRegisterIndex(instruction.registerY)];
      console.log(`Registers after ADD:`, registers);
      break;

    case 'ADDCY':
      const carry = data.carry || 0;
      registers[getRegisterIndex(instruction.registerX)] += (registers[getRegisterIndex(instruction.registerY)] + carry);
      console.log(`Registers after ADDCY:`, registers);
      break;

    case 'AND':
      registers[getRegisterIndex(instruction.registerX)] &= registers[getRegisterIndex(instruction.registerY)];
      console.log(`Registers after AND:`, registers);
      break;

    case 'CALL':
      data.stack.push(data.pc);
      data.pc = instruction.address;
      console.log(`Stack after CALL:`, data.stack, `PC:`, data.pc);
      break;

    case 'COMPARE':
      data.flags.zero = (registers[getRegisterIndex(instruction.registerX)] === registers[getRegisterIndex(instruction.registerY)]);
      console.log(`Zero flag after COMPARE:`, data.flags.zero);
      break;

    case 'DISABLE':
      data.interruptEnabled = false;
      console.log(`Interrupts disabled`);
      break;

    case 'ENABLE':
      data.interruptEnabled = true;
      console.log(`Interrupts enabled`);
      break;

    case 'JUMP':
      data.pc = instruction.address;
      console.log(`PC after JUMP:`, data.pc);
      break;

    case 'LOAD&RETURN':
      registers[getRegisterIndex(instruction.registerX)] = parseInt(instruction.value, 10);
      data.pc = data.stack.pop();
      console.log(`Registers after LOAD&RETURN:`, registers, `PC:`, data.pc);
      break;

    case 'OR':
      registers[getRegisterIndex(instruction.registerX)] |= registers[getRegisterIndex(instruction.registerY)];
      console.log(`Registers after OR:`, registers);
      break;

      case 'OUTPUT':
        console.log('OUTPUT instruction received:', instruction);  // Log the instruction
        const port = instruction.port;
        const outputValue = instruction.value;
    
        if (port === 0) {  // Port 0 controls LEDs
          for (let i = 0; i < 16; i++) {
            data.leds[i] = (outputValue >> i) & 1;  // Turns on LED if the bit is 1
          }
          console.log('LED states updated:', data.leds);
        } else if (port === 1) {  // Port 1 controls RGB LED
          data.rgb.r = (outputValue & 1) === 1;
          data.rgb.g = (outputValue & 2) === 2;
          data.rgb.b = (outputValue & 4) === 4;
          console.log('RGB LED state updated:', data.rgb);
        }
        break;
    

    case 'RL':
      registers[getRegisterIndex(instruction.registerX)] = (registers[getRegisterIndex(instruction.registerX)] << 1) & 255;
      console.log(`Registers after RL:`, registers);
      break;

    case 'SUB':
      const regXSub = parseInt(instruction.registerX.slice(1), 16);
      if (instruction.registerY) {
        const regYSub = parseInt(instruction.registerY.slice(1), 16);
        registers[regXSub] -= registers[regYSub];
        console.log(`Registers after SUB (register-to-register):`, registers);
      } else if (instruction.value !== undefined) {
        const valueSub = instruction.value;
        registers[regXSub] -= valueSub;
        console.log(`Registers after SUB (register-to-value):`, registers);
      }
      break;

    case 'SUBCY':
      const subCarry = data.carry || 0;
      registers[getRegisterIndex(instruction.registerX)] -= (registers[getRegisterIndex(instruction.registerY)] + subCarry);
      console.log(`Registers after SUBCY:`, registers);
      break;

    case 'XOR':
      registers[getRegisterIndex(instruction.registerX)] ^= registers[getRegisterIndex(instruction.registerY)];
      console.log(`Registers after XOR:`, registers);
      break;

    case 'RETURN':
      console.log("Executing RETURN");
      if (data.stack.length > 0) {
        data.pc = data.stack.pop();
        console.log('PC after RETURN:', data.pc);
      } else {
        console.warn('RETURN called with an empty stack!');
      }
      break;

    default:
      console.warn(`Unknown instruction: ${instruction.type}`);
      break;
  }

  data.registers = registers;
  return data;
};

export default executeInstruction;
