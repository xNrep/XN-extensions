(function (Scratch) {
  "use strict";

  const values = new Map();

  function normalizeColor(value) {
    const text = String(value).trim();

    if (/^#[0-9a-f]{6}$/i.test(text)) {
      return text.toUpperCase();
    }

    if (/^#[0-9a-f]{3}$/i.test(text)) {
      return "#" +
        text[1] + text[1] +
        text[2] + text[2] +
        text[3] + text[3];
    }

    if (/^rgba?\(/i.test(text) || /^[a-z]+$/i.test(text)) {
      return text;
    }

    return text;
  }

  class XNColorValues {
    getInfo() {
      return {
        id: "xnColorValues",
        name: "XN Color Values",
        color1: "#3498DB",
        color2: "#2980B9",
        blocks: [
          {
            opcode: "set",
            blockType: Scratch.BlockType.COMMAND,
            text: "set color value [NAME] to [COLOR]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "mainColor" },
              COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: "#ff0000" }
            }
          },
          {
            opcode: "get",
            blockType: Scratch.BlockType.REPORTER,
            text: "color value [NAME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "mainColor" }
            }
          },
          {
            opcode: "exists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "color value [NAME] exists?",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "mainColor" }
            }
          },
          {
            opcode: "delete",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete color value [NAME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "mainColor" }
            }
          },
          {
            opcode: "clear",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete all color values"
          },
          {
            opcode: "setRGB",
            blockType: Scratch.BlockType.COMMAND,
            text: "set color value [NAME] from R [R] G [G] B [B]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "mainColor" },
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
              G: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          }
        ]
      };
    }

    set({ NAME, COLOR }) {
      values.set(String(NAME), normalizeColor(COLOR));
    }

    get({ NAME }) {
      return values.get(String(NAME)) ?? "";
    }

    exists({ NAME }) {
      return values.has(String(NAME));
    }

    delete({ NAME }) {
      values.delete(String(NAME));
    }

    clear() {
      values.clear();
    }

    setRGB({ NAME, R, G, B }) {
      const clamp = n => Math.max(0, Math.min(255, Math.round(Number(n) || 0)));
      const hex = n => clamp(n).toString(16).padStart(2, "0").toUpperCase();
      values.set(
        String(NAME),
        "#" + hex(R) + hex(G) + hex(B)
      );
    }
  }

  Scratch.extensions.register(new XNColorValues());
})(Scratch);
