const { execSync } = require("node:child_process");
const { getJava17Home, getJavaEnv } = require("../checks/java");
const {
  getAndroidSdkHome,
  getAndroidEnv,
} = require("../checks/android");

function android() {
  const java17 = getJava17Home();

  if (!java17) {
    console.log("Não foi possível obter o JDK 17.");
    return;
  }

  const androidSdk = getAndroidSdkHome();

  if (!androidSdk) {
    console.log("Não foi possível encontrar o Android SDK.");
    return;
  }

  execSync("npx expo run:android", {
    stdio: "inherit",
    env: {
      ...getJavaEnv(java17),
      ...getAndroidEnv(androidSdk),
    },
  });
}

module.exports = android;