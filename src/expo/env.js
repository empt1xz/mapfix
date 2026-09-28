const fs = require("node:fs");
const path = require("node:path");

function createEnvFile() {
  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, "EXPO_PUBLIC_KEY_GOOGLE_MAPS=\n");

    console.log(".env criado!");

    return;
  }

  let content = fs.readFileSync(envPath, "utf-8");

  const hasGoogleMapsKey = /^EXPO_PUBLIC_KEY_GOOGLE_MAPS=/m.test(content);

  if (hasGoogleMapsKey) {
    console.log("Chave do Google Maps já existe no .env.");

    return;
  }

  if (content.length > 0 && !content.endsWith("\n")) {
    content += "\n";
  }

  content += "EXPO_PUBLIC_KEY_GOOGLE_MAPS=\n";

  fs.writeFileSync(envPath, content);

  console.log("Chave do Google Maps adicionada ao .env!");
}

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf-8");

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);

    if (!match) continue;

    const [, key, value] = match;

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

}

module.exports = {
  createEnvFile,
  loadEnv,
};
