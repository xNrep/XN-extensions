(function (Scratch) {
  "use strict";

  // Built-in words are intentionally kept internal.
  const BUILT_IN = new Set([
    "fuck", "fucker", "fucking", "shit", "bullshit",
    "bitch", "bastard", "asshole", "dick", "dumbass",
    "piss", "crap", "slut", "whore"
  ]);

  const customWords = new Set();
  let lastStatus = "No text checked yet.";

  function normalize(text) {
    return String(text)
      .toLowerCase()
      .replace(/[0-9@]/g, function (c) {
        return ({ "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a" })[c] || c;
      });
  }

  function getWords() {
    return new Set([...BUILT_IN, ...customWords]);
  }

  function containsBlocked(text) {
    const normalized = normalize(text);
    for (const word of getWords()) {
      if (normalized.includes(word)) return true;
    }
    return false;
  }

  function filterText(text, replacement) {
    let result = String(text);
    const rep = replacement === undefined ? "*" : String(replacement);

    for (const word of getWords()) {
      if (!word) continue;
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "gi");
      result = result.replace(regex, rep.repeat(Math.max(1, word.length)));
    }

    return result;
  }

  class XNTextFilter {
    getInfo() {
      return {
        id: "xnTextFilter",
        name: "XN Text Filter",
        color1: "#E67E22",
        color2: "#D35400",
        blocks: [
          {
            opcode: "filter",
            blockType: Scratch.BlockType.REPORTER,
            text: "filter text [TEXT]",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello" }
            }
          },
          {
            opcode: "filterWith",
            blockType: Scratch.BlockType.REPORTER,
            text: "filter [TEXT] replacing with [REP]",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello" },
              REP: { type: Scratch.ArgumentType.STRING, defaultValue: "*" }
            }
          },
          {
            opcode: "contains",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "text [TEXT] contains filtered content?",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello" }
            }
          },
          {
            opcode: "addWord",
            blockType: Scratch.BlockType.COMMAND,
            text: "add custom filtered word [WORD]",
            arguments: {
              WORD: { type: Scratch.ArgumentType.STRING, defaultValue: "example" }
            }
          },
          {
            opcode: "removeWord",
            blockType: Scratch.BlockType.COMMAND,
            text: "remove custom filtered word [WORD]",
            arguments: {
              WORD: { type: Scratch.ArgumentType.STRING, defaultValue: "example" }
            }
          },
          {
            opcode: "clearWords",
            blockType: Scratch.BlockType.COMMAND,
            text: "clear custom filtered words"
          },
          {
            opcode: "status",
            blockType: Scratch.BlockType.REPORTER,
            text: "text filter status"
          }
        ]
      };
    }

    filter({ TEXT }) {
      const result = filterText(TEXT, "*");
      lastStatus = containsBlocked(TEXT) ? "Filtered content detected." : "No filtered content.";
      return result;
    }

    filterWith({ TEXT, REP }) {
      const result = filterText(TEXT, REP);
      lastStatus = containsBlocked(TEXT) ? "Filtered content detected." : "No filtered content.";
      return result;
    }

    contains({ TEXT }) {
      const found = containsBlocked(TEXT);
      lastStatus = found ? "Filtered content detected." : "No filtered content.";
      return found;
    }

    addWord({ WORD }) {
      const word = normalize(WORD).trim();
      if (word) customWords.add(word);
      lastStatus = "Custom word added.";
    }

    removeWord({ WORD }) {
      customWords.delete(normalize(WORD).trim());
      lastStatus = "Custom word removed.";
    }

    clearWords() {
      customWords.clear();
      lastStatus = "Custom filtered words cleared.";
    }

    status() {
      return lastStatus;
    }
  }

  Scratch.extensions.register(new XNTextFilter());
})(Scratch);
