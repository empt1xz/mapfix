#!/usr/bin/env node

const setup = require("./commands/setup");
const android = require("./commands/android");
const { runPrebuild } = require("./expo/prebuild");

function main() {
  const command = process.argv[2];

  if (!command) {
    console.log("Use: bussz setup | prebuild | android");
    return;
  }

  if (command === "setup") {
    setup();
    return;
  }

  if (command === "prebuild") {
    runPrebuild(process.argv.includes("--clean"));
    return;
  }

  if (command === "android") {
    android();
    return;
  }

  console.log(`Comando desconhecido: ${command}`);
}

main();
