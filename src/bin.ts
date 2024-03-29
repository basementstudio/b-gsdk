#!/usr/bin/env node

require("dotenv").config();
import { main } from ".";
import { formatError } from "./util/format-error";
import arg from "arg";

// Show usage and exit with code
function help(code: number) {
  console.log(`Usage:
  
  b-gsdk generate
  
  `);
  process.exit(code);
}

// Get CLI arguments
const [, , cmd] = process.argv;

const args = arg(
  {
    // types
    "--dir": String,
    // aliases
    "-d": "--dir",
  },
  { permissive: true }
);

// CLI commands
const cmds: { [key: string]: (args: Args) => Promise<void> } = {
  generate: main,
};

// Run CLI
try {
  // Run command or show usage for unknown command
  cmds[cmd]
    ? cmds[cmd](args)
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          console.error(formatError(error));
          process.exit(1);
        })
    : help(0);
} catch (e) {
  console.error(formatError(e).message);
  process.exit(1);
}

export type Args = typeof args;
