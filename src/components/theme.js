
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

monaco.editor.defineTheme('myCoolTheme', {
    base: 'vs', // Can be 'vs', 'vs-dark', or 'hc-black'
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'FF0000', fontStyle: 'bold' }, // Red color for keywords
      { token: 'address', foreground: '007F7F' }, // Teal color for addresses
      { token: 'number', foreground: '0000FF' }, // Blue color for numbers
      { token: 'number_system', foreground: '800080' }, // Purple color for number systems
      { token: 'register', foreground: 'FF8C00' }, // Dark orange for registers
      { token: 'label', foreground: 'A52A2A' }, // Brown color for labels
      { token: 'comment', foreground: '008000', fontStyle: 'italic' }, // Green for comments
      { token: 'string', foreground: 'FF4500' }, // OrangeRed for strings
    ],
    colors: {
      'editor.background': '#FFFFFF', // White background
      'editor.foreground': '#000000'  // Black text
    }
  });
  