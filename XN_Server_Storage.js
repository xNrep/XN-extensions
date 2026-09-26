(function (Scratch) {
  "use strict";

  const BASE_URL = "https://gen1x.derpygamer2142.com";
  let lastStatus = "No requests made yet.";

  class XNServerStorage {
    getInfo() {
      return {
        id: "xnServerStorage",
        name: "XN Server Storage",
        color1: "#5865F2",
        color2: "#4752C4",
        blocks: [
          {
            opcode: "save",
            blockType: Scratch.BlockType.COMMAND,
            text: "save [KEY] as [VAL]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "player" },
              VAL: { type: Scratch.ArgumentType.STRING, defaultValue: "value" }
            }
          },
          {
            opcode: "saveLocked",
            blockType: Scratch.BlockType.COMMAND,
            text: "save [KEY] as [VAL] | locked [LOCK]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "player" },
              VAL: { type: Scratch.ArgumentType.STRING, defaultValue: "value" },
              LOCK: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: false }
            }
          },
          {
            opcode: "load",
            blockType: Scratch.BlockType.REPORTER,
            text: "load [KEY]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "player" }
            }
          },
          {
            opcode: "info",
            blockType: Scratch.BlockType.REPORTER,
            text: "server info for [KEY]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "player" }
            }
          },
          {
            opcode: "exists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "server has [KEY]?",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "player" }
            }
          },
          {
            opcode: "change",
            blockType: Scratch.BlockType.COMMAND,
            text: "change [KEY] by [NUM]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "coins" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: "status",
            blockType: Scratch.BlockType.REPORTER,
            text: "last server status"
          }
        ]
      };
    }

    async request(path, options = {}) {
      try {
        const response = await Scratch.fetch(BASE_URL + path, options);
        const text = await response.text();
        lastStatus = response.status + " " + response.statusText;
        return { ok: response.ok, status: response.status, text };
      } catch (e) {
        lastStatus = "ERROR: " + String(e);
        return { ok: false, status: 0, text: "" };
      }
    }

    async save({ KEY, VAL }) {
      return this._save(KEY, VAL, false);
    }

    async saveLocked({ KEY, VAL, LOCK }) {
      return this._save(KEY, VAL, !!LOCK);
    }

    async _save(key, value, lock) {
      const body = JSON.stringify({
        key: String(key),
        value: String(value),
        lock: lock
      });

      await this.request("/storage/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });
    }

    async load({ KEY }) {
      const result = await this.request(
        "/storage/get/" + encodeURIComponent(String(KEY))
      );

      if (!result.ok) return "";
      try {
        const data = JSON.parse(result.text);
        if (data && typeof data === "object") {
          if ("value" in data) return String(data.value);
          if ("data" in data) return String(data.data);
        }
      } catch (e) {}
      return result.text;
    }

    async info({ KEY }) {
      const result = await this.request(
        "/storage/attrs/" + encodeURIComponent(String(KEY))
      );
      return result.ok ? result.text : "";
    }

    async exists({ KEY }) {
      const result = await this.request(
        "/storage/exists/" + encodeURIComponent(String(KEY))
      );
      if (!result.ok) return false;

      try {
        const data = JSON.parse(result.text);
        if (typeof data === "boolean") return data;
        if (data && typeof data.exists !== "undefined") return !!data.exists;
      } catch (e) {}

      return String(result.text).trim().toLowerCase() === "true";
    }

    async change({ KEY, NUM }) {
      const current = Number(await this.load({ KEY }));
      const amount = Number(NUM);
      const next = (Number.isFinite(current) ? current : 0) +
                   (Number.isFinite(amount) ? amount : 0);

      await this.save({ KEY, VAL: String(next) });
    }

    status() {
      return lastStatus;
    }
  }

  Scratch.extensions.register(new XNServerStorage());
})(Scratch);
