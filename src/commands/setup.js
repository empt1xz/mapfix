const { isExpoProject } = require("../checks/expo");
const { getJava17Home } = require("../checks/java");
const { runPrebuild } = require("../expo/prebuild");
const fs = require("node:fs");
const path = require("node:path");

const {
  hasReactNativeMaps,
  installReactNativeMaps,
} = require("../expo/maps");

const {
  getExpoConfig,
  readAppJson,
  createAppConfig,
  hasMapsPlugin,
  addMapsPlugin,
  validateConfig,
  createDefaultAppConfig,
} = require("../expo/config");

const { createEnvFile, loadEnv } = require("../expo/env");

function setup() {
  if (!isExpoProject()) {
    console.log("Este não parece ser um projeto Expo.");
    return;
  }

  console.log("Projeto Expo encontrado!");

  
  if (!runPrebuild()) {
    return;
  }

  loadEnv();

  const java17 = getJava17Home();

  if (!java17) {
    console.log("Precisamos instalar o JDK 17.");
    return;
  }

  const hasMaps = hasReactNativeMaps();

  if (!hasMaps) {
    const installed = installReactNativeMaps();

    if (!installed) {
      return;
    }

    console.log("react-native-maps instalado!");
  } else {
    console.log("react-native-maps encontrado!");
  }

  const config = getExpoConfig();

  if (!config) {
    createDefaultAppConfig();
  } else {
    console.log(`Configuração encontrada: ${config}`);

    if (config === "app.json") {
      const appJson = readAppJson();

      createAppConfig(appJson);

      console.log("app.config.js criado!");
    }
  }

  createEnvFile();

  const hasPlugin = hasMapsPlugin();

  if (!hasPlugin) {
    addMapsPlugin();
  } else {
    console.log("Plugin react-native-maps encontrado!");
  }

  
  runPrebuild();

  validateConfig();

 
  const appJsonPath = path.join(process.cwd(), "app.json");

  if (fs.existsSync(appJsonPath)) {
    fs.unlinkSync(appJsonPath);
    console.log("app.json removido!");
  }
}

module.exports = setup;