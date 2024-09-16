// picoblaze.js

const picoBlazeLanguage = {
  tokenizer: {
    root: [
      // Instructions
      [
        /\b(?:ADD|ADDCY|AND|CALL|CALL@|COMPARE|COMPARECY|DISABLE|ENABLE|FETCH|HWBUILD|INPUT|JUMP|JUMP@|LOAD|LOAD&RETURN|OR|OUTPUT|OUTPUTK|REGBANK|RETURN|RETURNI|RL|RR|SL0|SL1|SLA|SLX|SR0|SR1|SRA|SRX|STAR|STORE|SUB|SUBCY|TEST|TESTCY|XOR)\b/,
        'keyword'
      ],
      // Preprocessor Directives
      [
        /\b(?:ADDRESS|NAMEREG|CONSTANT)\b/,
        'preprocessor'
      ],
      // Registers
      [
        /(?<=[^\s,()])[sS][0-9A-F](?=[, )]|$)/,
        'register'
      ],
      // Comments
      [
        /;[^\n]*/,
        'comment'
      ],
      // Strings
      [
        /"(?:[^"\\]|\\.)*"/,
        'string'
      ],
      // Numbers
      [
        /(?:[0-1]{8}|[0-9]{1,3}|[0-9A-F]{2})(?=[\s,;\n]|$)/,
        'number'
      ],
      // Number Systems
      [
        /(?<=[0-9A-F])'[db]{1}(?=[\s;\n]|$)/,
        'number_system'
      ],
      // Labels
      [
        /[A-Z][A-Z0-9]*:/,
        'label'
      ],
      // Addresses
      [
        /(?<!\w)([0-9A-F]{3})(?=\s|$)/,
        'address'
      ]
    ],
  },
  // Define illegal characters that should be flagged
  illegal: /[\\_.ŽĆČŠĐ<>{}[\]&%$#!=?*+/]/,
};

export default picoBlazeLanguage;
