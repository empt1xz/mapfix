const { execSync } = require("node:child_process");

function runPrebuild(clean = false) {
  try {
    const command = clean ? "npx expo prebuild --clean" : "npx expo prebuild";

    execSync(command, {
      stdio: "inherit",
    });

    return true;
  } catch {
    console.log("Não foi possível executar o prebuild.");
    return false;
  }
}

module.exports = {
  runPrebuild,
};
