const fs = require("node:fs");
const path = require("node:path");

function getExpoConfig() {
  const cwd = process.cwd();

  const appJsonPath = path.join(cwd, "app.json");
  const appConfigPath = path.join(cwd, "app.config.js");

  if (fs.existsSync(appConfigPath)) {
    return "app.config.js";
  }

  if (fs.existsSync(appJsonPath)) {
    return "app.json";
  }

  return null;
}

function readAppJson() {
  const appJsonPath = path.join(process.cwd(), "app.json");

  return JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
}

function createAppConfig(appJson) {
  const appConfigPath = path.join(process.cwd(), "app.config.js");

  const config = structuredClone(appJson);

  const plugins = config.expo.plugins ?? [];

  plugins.push([
    "react-native-maps",
    {
      androidGoogleMapsApiKey: "__EXPO_MAPS_ENV__",
    },
  ]);

  config.expo.plugins = plugins;

  let content = JSON.stringify(config, null, 2);

  content = content.replace(
    `"__EXPO_MAPS_ENV__"`,
    "process.env.EXPO_PUBLIC_KEY_GOOGLE_MAPS",
  );

  content = `module.exports = ${content};`;

  fs.writeFileSync(appConfigPath, content);
}

function hasMapsPlugin() {
  const config = require(path.join(process.cwd(), "app.config.js"));

  return config.expo.plugins?.some((plugin) => {
    if (typeof plugin === "string") {
      return plugin === "react-native-maps";
    }

    return plugin[0] === "react-native-maps";
  });
}

function addMapsPlugin() {
  const appConfigPath = path.join(process.cwd(), "app.config.js");

  let content = fs.readFileSync(appConfigPath, "utf-8");

  const mapsPlugin = `[
        "react-native-maps",
        {
          androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_KEY_GOOGLE_MAPS,
        }
      ]`;

  content = content.replace(
    /"?plugins"?\s*:\s*\[/,
    `plugins: [\n      ${mapsPlugin},`,
  );

  fs.writeFileSync(appConfigPath, content);

  console.log("Plugin react-native-maps adicionado!");
}

function validateConfig() {
  try {
    const config = require(path.join(process.cwd(), "app.config.js"));

    const plugins = config.expo?.plugins ?? [];

    const mapsPlugin = plugins.find((plugin) => {
      if (typeof plugin === "string") {
        return plugin === "react-native-maps";
      }

      return plugin[0] === "react-native-maps";
    });

    if (!mapsPlugin) {
      console.log("Plugin react-native-maps não encontrado.");

      return false;
    }

    if (!process.env.EXPO_PUBLIC_KEY_GOOGLE_MAPS) {
      console.log(
        "Google Maps API Key não configurada. " +
          "Configure EXPO_PUBLIC_KEY_GOOGLE_MAPS no .env.",
      );

      return false;
    }

    console.log("Configuração do Google Maps já configurada!");

    return true;
  } catch {
    console.log("Não foi possível validar o app.config.js.");

    return false;
  }
}

function createDefaultAppConfig() {
  const appConfigPath = path.join(process.cwd(), "app.config.js");

  const content = `module.exports = {
  expo: {
    name: "meu-app",
    slug: "meu-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",

    plugins: [
      "expo-router",
      [
        "react-native-maps",
        {
          androidGoogleMapsApiKey:
            process.env.EXPO_PUBLIC_KEY_GOOGLE_MAPS,
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};`;

  fs.writeFileSync(appConfigPath, content);

  console.log("app.config.js criado!");
}

module.exports = {
  getExpoConfig,
  readAppJson,
  createDefaultAppConfig,
  createAppConfig,
  hasMapsPlugin,
  addMapsPlugin,
  validateConfig,
};
