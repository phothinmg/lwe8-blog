#!/usr/bin/env node
import { program } from "commander";
import fs from "node:fs";
import { server } from "../lib/index.js";
const pack = JSON.parse(fs.readFileSync("package.json", "utf8"));
const _version = pack.version;

program
  .version(_version)
  .description("Run server")
  .option("-r,--run", "run the server", server);

program.parse();
