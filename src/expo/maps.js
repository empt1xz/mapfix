const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function hasReactNativeMaps() {
  const packageJsonPath = path.join(
    process.cwd(),
    "package.json",
  );

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8"),
  );

  return Boolean(
    packageJson.dependencies?.["react-native-maps"] ||
    packageJson.devDependencies?.["react-native-maps"],
  );
}

function installReactNativeMaps() {
  try {
    execSync("npx expo install react-native-maps", {
      stdio: "inherit",
    });

    return true;
  } catch {
    console.log(
      "Não foi possível instalar o react-native-maps.",
    );

    return false;
  }
}

module.exports = {
  hasReactNativeMaps,
  installReactNativeMaps,
};