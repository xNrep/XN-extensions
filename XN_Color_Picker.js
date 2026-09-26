(function (Scratch) {
  "use strict";

  function parseColor(value) {
    const input = String(value).trim();

    if (/^#[0-9a-f]{6}$/i.test(input)) {
      return {
        r: parseInt(input.slice(1, 3), 16),
        g: parseInt(input.slice(3, 5), 16),
        b: parseInt(input.slice(5, 7), 16)
      };
    }

    if (/^#[0-9a-f]{3}$/i.test(input)) {
      return {
        r: parseInt(input[1] + input[1], 16),
        g: parseInt(input[2] + input[2], 16),
        b: parseInt(input[3] + input[3], 16)
      };
    }

    const match = input.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (match) {
      return {
        r: Math.min(255, Number(match[1])),
        g: Math.min(255, Number(match[2])),
        b: Math.min(255, Number(match[3]))
      };
    }

    return null;
  }

  function toHex(n) {
    return Math.max(0, Math.min(255, Math.round(n)))
      .toString(16).padStart(2, "0").toUpperCase();
  }

  class XNColorPicker {
    getInfo() {
      return {
        id: "xnColorPicker",
        name: "XN Color Picker",
        color1: "#8E44AD",
        color2: "#71368A",
        blocks: [
          {
            opcode: "pick",
            blockType: Scratch.BlockType.REPORTER,
            text: "pick a color"
          },
          {
            opcode: "rgb",
            blockType: Scratch.BlockType.REPORTER,
            text: "RGB of color [COLOR]",
            arguments: {
              COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: "#ff0000" }
            }
          },
          {
            opcode: "fromRGB",
            blockType: Scratch.BlockType.REPORTER,
            text: "color from R [R] G [G] B [B]",
            arguments: {
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
              G: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: "valid",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[COLOR] is a valid color?",
            arguments: {
              COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: "#ff0000" }
            }
          }
        ]
      };
    }

    pick() {
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "color";
        input.value = "#ff0000";
        input.style.position = "fixed";
        input.style.left = "-10000px";
        document.body.appendChild(input);

        let finished = false;

        const done = () => {
          if (finished) return;
          finished = true;
          const value = input.value;
          input.remove();
          resolve(value);
        };

        input.addEventListener("change", done, { once: true });
        input.addEventListener("input", done, { once: true });
        input.click();

        setTimeout(() => {
          if (!finished) done();
        }, 60000);
      });
    }

    rgb({ COLOR }) {
      const c = parseColor(COLOR);
      return c ? `rgb(${c.r}, ${c.g}, ${c.b})` : "";
    }

    fromRGB({ R, G, B }) {
      return "#" + toHex(R) + toHex(G) + toHex(B);
    }

    valid({ COLOR }) {
      return !!parseColor(COLOR);
    }
  }

  Scratch.extensions.register(new XNColorPicker());
})(Scratch);
