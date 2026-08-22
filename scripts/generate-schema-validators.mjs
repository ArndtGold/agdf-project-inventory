import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import standaloneCode from "ajv/dist/standalone/index.js";
import { _ } from "ajv/dist/compile/codegen/index.js";
import { fullFormats } from "ajv-formats/dist/formats.js";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const schemaRoot = join(repoRoot, "plugin", "skills", "project-inventory", "assets", "schemas");
const target = join(repoRoot, "plugin", "skills", "project-inventory", "scripts", "lib", "validator", "generated-schema-validators.mjs");
const dateTimeCode = _`{
  "date-time": {
    validate: (value) => {
      const dateMatch = /^(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)$/.exec(String(value).split(/t|\\s/i)[0] || "");
      const parts = String(value).split(/t|\\s/i);
      if (parts.length !== 2 || !dateMatch) return false;
      const year = +dateMatch[1];
      const month = +dateMatch[2];
      const day = +dateMatch[3];
      const days = [0, 31, year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month < 1 || month > 12 || day < 1 || day > days[month]) return false;
      const timeMatch = /^(\\d\\d):(\\d\\d):(\\d\\d(?:\\.\\d+)?)(z|([+-])(\\d\\d)(?::?(\\d\\d))?)$/i.exec(parts[1]);
      if (!timeMatch) return false;
      const hour = +timeMatch[1];
      const minute = +timeMatch[2];
      const second = +timeMatch[3];
      const sign = timeMatch[5] === "-" ? -1 : 1;
      const zoneHour = +(timeMatch[6] || 0);
      const zoneMinute = +(timeMatch[7] || 0);
      if (zoneHour > 23 || zoneMinute > 59) return false;
      if (hour <= 23 && minute <= 59 && second < 60) return true;
      const utcMinute = minute - zoneMinute * sign;
      const utcHour = hour - zoneHour * sign - (utcMinute < 0 ? 1 : 0);
      return (utcHour === 23 || utcHour === -1) && (utcMinute === 59 || utcMinute === -1) && second < 61;
    }
  }
}`;
const ajv = new Ajv2020({ allErrors: true, strict: true, code: { source: true, esm: true, formats: dateTimeCode } });
ajv.addFormat("date-time", { validate: fullFormats["date-time"].validate });

const exports = {};
const digests = {};
for (const filename of readdirSync(schemaRoot).filter((name) => name.endsWith(".schema.json")).sort()) {
  const bytes = readFileSync(join(schemaRoot, filename));
  const name = basename(filename, ".schema.json");
  const exportName = name.replaceAll("-", "_");
  ajv.addSchema(JSON.parse(bytes.toString("utf8")), name);
  exports[exportName] = name;
  digests[name] = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

const ucs2Length = `(function ucs2length(value) { let length = 0; for (let position = 0; position < value.length; position += 1) { length += 1; const first = value.charCodeAt(position); if (first >= 0xd800 && first <= 0xdbff && position + 1 < value.length && (value.charCodeAt(position + 1) & 0xfc00) === 0xdc00) position += 1; } return length; })`;
const deepEqual = `(function equal(left, right) { if (left === right) return true; if (left && right && typeof left === "object" && typeof right === "object") { if (left.constructor !== right.constructor) return false; if (Array.isArray(left)) { if (left.length !== right.length) return false; for (let index = left.length; index-- !== 0;) if (!equal(left[index], right[index])) return false; return true; } if (left.constructor === RegExp) return left.source === right.source && left.flags === right.flags; if (left.valueOf !== Object.prototype.valueOf) return left.valueOf() === right.valueOf(); if (left.toString !== Object.prototype.toString) return left.toString() === right.toString(); const keys = Object.keys(left); if (keys.length !== Object.keys(right).length) return false; for (const key of keys) if (!Object.prototype.hasOwnProperty.call(right, key) || !equal(left[key], right[key])) return false; return true; } return left !== left && right !== right; })`;
const generated = standaloneCode(ajv, exports)
  .replaceAll('require("ajv/dist/runtime/ucs2length").default', ucs2Length)
  .replaceAll('require("ajv/dist/runtime/equal").default', deepEqual);
const validatorEntries = Object.keys(exports).sort().map((name) => `${JSON.stringify(exports[name])}: ${name}`).join(", ");
const footer = `\nexport const validators = { ${validatorEntries} };\nexport const schemaDigests = ${JSON.stringify(digests, null, 2)};\n`;
writeFileSync(target, `${generated.trimEnd()}${footer}`, "utf8");
