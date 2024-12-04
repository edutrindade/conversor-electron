import "dotenv/config";
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./src/helpers/database.js";
import { exportProductsToExcel } from "./src/utils/excel/products.js";
import { exportCustomersToExcel } from "./src/utils/excel/customers.js";
import { queryProducts } from "./src/utils/scripts/products.js";
import { queryCustomers } from "./src/utils/scripts/customers.js";
import { isValidCNPJ, isValidCPF, generateRandomCPF } from "./src/utils/validations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isError(obj) {
  return obj && obj.message && typeof obj.message === "string";
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      //devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  let indexPath;

  if (app.isPackaged) {
    indexPath = path.join(__dirname, "dist", "index.html");
  } else {
    indexPath = "";
  }

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(indexPath);
    //win.webContents.openDevTools();
    //win.loadURL(new URL(`file://${join(__dirname, '../dist/index.html')}`).toString());
  }

  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Inspecionar',
  //     click: () => {
  //       win.webContents.openDevTools();
  //     },
  //   },
  // ]);

  // win.webContents.on('context-menu', (e, params) => {
  //   e.preventDefault();
  //   contextMenu.popup();
  // });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("select-database", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Firebird Databases", extensions: ["fb"] }],
  });

  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});

ipcMain.handle("export-products-data", async (event, dbPath) => {
  try {
    const db = await connectToDatabase(dbPath);

    db.query(queryProducts, [], async (err, result) => {
      if (err) {
        console.error(`Erro na consulta ao banco de dados: ${err.message}`);
        db.detach();
        event.sender.send("export-error", err.message);
        return;
      }

      if (!result.length) {
        console.warn("Nenhum registro encontrado para exportar.");
        db.detach();
        event.sender.send(
          "export-error",
          "Nenhum registro encontrado para exportar."
        );
        return;
      }

      console.log(
        `Exportando ${result.length} registros de produtos para o Excel...`
      );

      try {
        const buffer = await exportProductsToExcel(result);
        db.detach();
        event.sender.send("export-success", buffer, "Produtos");
      } catch (exportError) {
        if (isError(exportError)) {
          console.error(`Erro ao exportar para Excel: ${exportError.message}`);
          db.detach();
          event.sender.send("export-error", exportError.message);
        } else {
          console.error("Erro desconhecido ao exportar para Excel");
        }
      }
    });
  } catch (error) {
    if (isError(error)) {
      console.error(`Erro ao processar: ${error.message}`);
      event.sender.send("export-error", error.message);
    } else {
      console.error("Erro desconhecido ao processar");
    }
  }
});

ipcMain.handle("export-customers-data", async (event, dbPath) => {
  try {
    const db = await connectToDatabase(dbPath);

    db.query(queryCustomers, [], async (err, result) => {
      if (err) {
        console.error(`Erro na consulta ao banco de dados: ${err.message}`);
        db.detach();
        event.sender.send("export-error", err.message);
        return;
      }

      if (!result.length) {
        console.warn("Nenhum registro de cliente encontrado para exportar.");
        db.detach();
        event.sender.send(
          "export-error",
          "Nenhum registro encontrado para exportar."
        );
        return;
      }

      // Validação de CPF/CNPJ
      result = result.map((row) => {
        const cpfCnpj = row["CPF/CNPJ"];
        if (!isValidCPF(cpfCnpj) && !isValidCNPJ(cpfCnpj)) {
          row["CPF/CNPJ"] = generateRandomCPF();
          row.isGenerated = true;
        } else {
          row.isGenerated = false;
        }
        return row;
      });

      console.log(
        `Exportando ${result.length} registros de clientes para o Excel...`
      );

      try {
        const buffer = await exportCustomersToExcel(result);
        db.detach();
        event.sender.send("export-success", buffer, "Clientes");
      } catch (exportError) {
        if (isError(exportError)) {
          console.error(
            `Erro ao exportar clientes para Excel: ${exportError.message}`
          );
          db.detach();
          event.sender.send("export-error", exportError.message);
        } else {
          console.error("Erro desconhecido ao exportar clientes para Excel");
        }
      }
    });
  } catch (error) {
    if (isError(error)) {
      console.error(`Erro ao processar: ${error.message}`);
      event.sender.send("export-error", error.message);
    } else {
      console.error("Erro desconhecido ao processar");
    }
  }
});

ipcMain.handle("get-total-rows", async (_event, dbPath) => {
  try {
    const db = await connectToDatabase(dbPath);

    const query = `SELECT COUNT(*) AS total FROM PRODUTO WHERE ATIVO = 'S';`;

    return new Promise((resolve, reject) => {
      db.query(query, [], (err, result) => {
        db.detach();
        if (err) {
          reject(err);
        } else {
          resolve(result[0].total);
        }
      });
    });
  } catch (error) {
    if (isError(error)) {
      console.error(`Erro ao contar linhas: ${error.message}`);
      throw error;
    } else {
      console.error("Erro desconhecido ao contar linhas");
      throw new Error("Erro desconhecido ao contar linhas");
    }
  }
});
