import Firebird from "node-firebird";
import path from "path";
import fs from "fs";

const dbOptions = {
  host: "localhost",
  port: 3050,
  database: "",
  user: "SYSDBA",
  password: "masterkey",
  role: undefined,
  pageSize: 4096,
};

///Users/eduardotrindade/downloads/Resulth/RESULTH.FB

export function connectToDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    const normalizedPath = path.normalize(dbPath);

    if (!fs.existsSync(normalizedPath)) {
      return reject(
        new Error(
          "Caminho inválido. Por favor, insira um caminho válido para o arquivo do banco de dados."
        )
      );
    }

    console.log("Caminho do banco de dados:", normalizedPath);

    dbOptions.database = normalizedPath;

    console.log("Conectando ao banco de dados...", dbOptions);

    Firebird.attach(dbOptions, (err, db) => {
      if (err) {
        return reject(err);
      }
      console.log("Conexão estabelecida com sucesso!");
      resolve(db);
    });
  });
}
