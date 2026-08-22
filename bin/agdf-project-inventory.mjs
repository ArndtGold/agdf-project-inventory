#!/usr/bin/env node
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { runCli } from "../src/cli/index.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.exitCode = await runCli(process.argv.slice(2), { repoRoot });
