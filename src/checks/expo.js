const fs = require("node:fs");
const path = require("node:path");

function isExpoProject() {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8"),
  );

  return Boolean(
    packageJson.dependencies?.expo ||
    packageJson.devDependencies?.expo,
  );
}

function hasAppJson() {
  const appJsonPath = path.join(process.cwd(), "app.json");

  return fs.existsSync(appJsonPath);
}

module.exports = {
  isExpoProject,
  hasAppJson,
};