import React, { useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import picoBlazeLanguage from './picoblaze'; // Adjust path as necessary
import './theme'; // Import your theme file

// Function to handle XMLHttpRequest
function xhr(url) {
  const req = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
          resolve(req);
        } else {
          console.error(`Error loading ${url}: ${req.statusText}`);
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
}

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

    // Initialize the editor with the custom theme
    const editorInstance = monaco.editor.create(container, {
      theme: 'myCoolTheme',
      value: getCode(),
      language: 'picoblaze',
      automaticLayout: true,
    });

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
  }, [onMount]);

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
