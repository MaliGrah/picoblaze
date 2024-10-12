import React, { useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import picoBlazeLanguage from './picoblaze'; // Adjust path as necessary
import './theme'; // Import your theme file

// Function to handle XMLHttpRequest
/* function xhr(url) {
  const req = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
          resolve(req);
        } else {
          console.error(Error loading ${url}: ${req.statusText});
          reject(req);
        }
      }
    };

    req.open('GET', url, true);
    req.responseType = '';
    req.send(null);
  }).catch(() => {
    req.abort();
  });
} */

  window.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: '${window.location.origin}'
        };
        importScripts('${window.location.origin}/monaco-editor/min/vs/base/worker/workerMain.js');`
      )}`;
    },
  };
  
  const Editor = ({ onMount }) => {
    const [breakpoints, setBreakpoints] = useState([]); // To store breakpoint line numbers
  
    useEffect(() => {
      const container = document.getElementById('container');
  
      // Register the PicoBlaze language with Monaco Editor
      monaco.languages.register({ id: 'picoblaze' });
      monaco.languages.setMonarchTokensProvider('picoblaze', picoBlazeLanguage);
  
      // Define and apply the custom theme
      monaco.editor.defineTheme('myCoolTheme', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'FF0000', fontStyle: 'bold' },
          { token: 'address', foreground: '007F7F' },
          { token: 'number', foreground: '0000FF' },
          { token: 'number_system', foreground: '800080' },
          { token: 'register', foreground: 'FF8C00' },
          { token: 'label', foreground: 'A52A2A' },
          { token: 'comment', foreground: '008000', fontStyle: 'italic' },
          { token: 'string', foreground: 'FF4500' },
        ],
        colors: {
          'editor.background': '#FFFFFF',
          'editor.foreground': '#000000',
        },
      });
  
      // Register autocomplete provider for PicoBlaze language
      monaco.languages.registerCompletionItemProvider('picoblaze', {
        triggerCharacters: ['L'], // Adding 'L' as the trigger character
  
        provideCompletionItems: (model, position) => {
          console.log('Autocomplete triggered at position:', position);
  
          var word = model.getWordUntilPosition(position);
          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
  
          var suggestions = [
            {
              label: 'LOAD',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'LOAD',
              documentation: 'Load a value into a register',
              range: range,
            },
          ];
  
          return { suggestions: suggestions };
        },
      });
  
      // Initialize the editor with the custom theme
      const editorInstance = monaco.editor.create(container, {
        theme: 'myCoolTheme',
        value: getCode(),
        language: 'picoblaze',
        automaticLayout: true,
        lineNumbers: 'on', // Enable line numbers
        glyphMargin: true, // Enable glyph margin for clickable breakpoints
        suggestOnTriggerCharacters: true, // Enable suggestions on trigger characters
        quickSuggestions: { other: true, comments: true, strings: true }, // Inline suggestions
        parameterHints: true, // Enable parameter hints
      });
  
      // Function to toggle breakpoints when the glyph margin is clicked
      editorInstance.onMouseDown((e) => {
        if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
          const lineNumber = e.target.position.lineNumber;
          toggleBreakpoint(editorInstance, lineNumber);
        }
      });
  
      // Toggle breakpoints
      function toggleBreakpoint(editor, lineNumber) {
        const newBreakpoints = [...breakpoints];
        const existingBreakpointIndex = newBreakpoints.indexOf(lineNumber);
  
        if (existingBreakpointIndex === -1) {
          // Add a breakpoint if it doesn't exist
          newBreakpoints.push(lineNumber);
          addBreakpointDecoration(editor, lineNumber);
        } else {
          // Remove the breakpoint if it already exists
          newBreakpoints.splice(existingBreakpointIndex, 1);
          removeBreakpointDecoration(editor, lineNumber);
        }
  
        setBreakpoints(newBreakpoints); // Update state with new breakpoints
      }
  
      // Add a decoration for a breakpoint
      function addBreakpointDecoration(editor, lineNumber) {
        editor.deltaDecorations([], [
          {
            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
            options: {
              isWholeLine: true,
              glyphMarginClassName: 'myBreakpoint', // Custom class for breakpoint marker
            },
          },
        ]);
      }
  
      // Remove a decoration for a breakpoint
      function removeBreakpointDecoration(editor, lineNumber) {
        const decorations = editor.getLineDecorations(lineNumber);
        const decorationIds = decorations
          .filter((d) => d.options.glyphMarginClassName === 'myBreakpoint')
          .map((d) => d.id);
        editor.deltaDecorations(decorationIds, []);
      }
  
      // Pass the editor instance to the parent component
      if (onMount && typeof onMount === 'function') {
        onMount(editorInstance);
      }
  
      // Cleanup on unmount
      return () => {
        if (editorInstance) {
          editorInstance.dispose();
        }
      };
    }, [onMount, breakpoints]);
  
    function getCode() {
      return [
        '10xy0 ADD s0 s1',
        '02xy0 AND s0 s1',
        '; This is a comment',
        // Add more PicoBlaze sample code here...
      ].join('\n');
    }
  
    return <div id="container" className="editor-container" style={{ height: '600px', width: '800px' }} />;
  };
  
  export default Editor;
