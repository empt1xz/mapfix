const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

function getAndroidSdkHome() {
  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    path.join(
      os.homedir(),
      "AppData",
      "Local",
      "Android",
      "Sdk",
    ),
  ];

  for (const sdkPath of candidates) {
    if (!sdkPath) continue;

    if (
      fs.existsSync(path.join(sdkPath, "platform-tools")) &&
      fs.existsSync(path.join(sdkPath, "platforms"))
    ) {
      console.log("Android SDK encontrado!");
      return sdkPath;
    }
  }

  console.log("Android SDK não encontrado.");

  return null;
}

function getAndroidEnv(sdkPath) {
  return {
    ANDROID_HOME: sdkPath,
    ANDROID_SDK_ROOT: sdkPath,
    PATH: `${path.join(
      sdkPath,
      "platform-tools",
    )}${path.delimiter}${process.env.PATH}`,
  };
}

module.exports = {
  getAndroidSdkHome,
  getAndroidEnv,
};