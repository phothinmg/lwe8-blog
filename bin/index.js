#!/usr/bin/env node
import { program } from "commander";
import fs from "node:fs";
import { server } from "../index.js";
const pack = JSON.parse(fs.readFileSync("package.json", "utf8"));
const _version = pack.version;

program
  .version(_version)
  .description("Lwe8 cli")
  .option("-s,--serve", "run the server", server);

program.parse();
