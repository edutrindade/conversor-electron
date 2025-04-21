import "dotenv/config";
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import ExcelJS from 'exceljs';
import path from "path";
import fs from 'node:fs';
import { fileURLToPath } from "url";
import { connectToDatabase } from "./src/helpers/database.js";
import { exportCustomersToExcel } from "./src/utils/excel/customers.js";
import { queryProductsBase, queryProductsBaseWithoutSG } from "./src/utils/scripts/products.js";
import { queryCustomers } from "./src/utils/scripts/customers.js";
import { isValidCNPJ, isValidCPF, generateRandomCPF } from "./src/utils/validations.js";
import { createProductColumns } from "./src/utils/excel/columns/products.js";

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
  /* Caixa "Salvar como" ------------------------------------------------*/
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Salvar planilha de produtos',
    defaultPath: 'Produtos.xlsx',
    filters: [{ name: 'Planilha Excel', extensions: ['xlsx'] }],
  });
  if (canceled || !filePath) {
    event.sender.send('export-error', 'Operação cancelada pelo usuário.');
    return;
  }
  const tmpPath = path.join(path.dirname(filePath), `.~${path.basename(filePath)}`);

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    filename: filePath,
    useStyles: true,
    useSharedStrings: true,
  });

  const worksheet = workbook.addWorksheet("Produtos");
  worksheet.columns = createProductColumns();

  console.log('Criando planilha com ', worksheet.columns.length, ' colunas');

  let db;
  try {
    /* 1. Conecta ao banco --------------------------------------------------*/
    db = await connectToDatabase(dbPath);

    /* 2. Conta quantos produtos tem e avisa o renderer que o processo começou*/
    const [{ TOTAL }] = await queryPromise(
      db,
      `SELECT COUNT(*) AS TOTAL FROM PRODUTO WHERE PRODUTO.ATIVO = 'S'`
    );

    console.log('Total de Produtos encontrados: ', TOTAL);
    event.sender.send('export-start', TOTAL);

    const keyMap = {
      Código: "codigo",
      Descrição: "descricao",
      Referência: "referencia",
      "Cód. Auxiliar": "codAuxiliar",
      Fornecedor: "fornecedor",
      "Fornecedor exclusivo": "fornecedorExclusivo",
      Comprador: "comprador",
      Empresa: "empresa",
      "Contabiliza saldo em estoque": "contabilizaSaldo",
      "Indisponível para venda": "indisponivelVenda",
      Setor: "setor",
      Linha: "linha",
      Marca: "marca",
      Coleção: "colecao",
      Espessura: "espessura",
      Classificação: "classificacao",
      Tamanho: "tamanho",
      Cores: "cores",
      "Unidade de venda": "unidadeVenda",
      "Múltiplo de venda": "multiploVenda",
      Moeda: "moeda",
      "Custo com ICMS (R$)": "custoICMS",
      "Desconto (%)": "desconto",
      "Acréscimo (%)": "acrescimo",
      "IPI (%)": "ipi",
      "Frete (R$)": "frete",
      "Despesas acessórias (R$)": "despesasAcessorias",
      "Substituição tributária (R$)": "substituicaoTributaria",
      "Diferencial ICMS (R$)": "diferencialICMS",
      "Mark-up (%)": "markup",
      "Preço de venda R$": "precoVenda",
      "Permite desconto": "permiteDesconto",
      "Comissão %": "comissao",
      "Configuração tributária": "configuracaoTributaria",
      NCM: "ncm",
      CEST: "cest",
      "Produto supérfluo": "produtoSuperfluo",
      "Tipo de item": "tipoItem",
      "Origem da mercadoria": "origemMercadoria",
      "Regime de Incidência PIS e COFINS": "regimeIncidencia",
      "Produto é brinde": "produtoBrinde",
      "Produto de catálogo": "produtoCatalogo",
      "Descrição de catálogo": "descricaoCatalogo",
      "Disponível na loja virtual": "disponivelLojaVirtual",
      "Exige controle": "exigeControle",
      "Tipo de controle": "tipoControle",
      "Tamanho controle": "tamanhoControle",
      "Peso bruto (kg)": "pesoBruto",
      "Peso líquido (kg)": "pesoLiquido",
      "Descrição complementar?": "descricaoComplementar",
      "Altura (frete)": "alturaFrete",
      "Largura (frete)": "larguraFrete",
      "Comprimento (frete)": "comprimentoFrete",
      Altura: "altura",
      Largura: "largura",
      Comprimento: "comprimento",
      "Importado por balança": "importadoBalanca",
      "Produto vendido por (balança)": "vendidoBalanca",
      "Quantidade mínima": "quantidadeMinima",
      "Quantidade máxima": "quantidadeMaxima",
      "Quantidade compra": "quantidadeCompra",
      Observação: "observacao",
      "Código de barras": "codigoBarras",
      Características: "caracteristicas",
      Status: "status",
    };

    /* 3. Determina o tamanho do lote dinamicamente --------------------------*/
    let BATCH_SIZE;
    if (TOTAL <= 2000) {
      BATCH_SIZE = 200;
    } else if (TOTAL <= 10000) {
      BATCH_SIZE = 500;
    } else {
      BATCH_SIZE = 1000;
    }

    /* 4. Lê e grava lotes --------------------------------------------------*/
    let totalRows = 0;
    try {
      for await (const rows of fetchBatches(db, BATCH_SIZE)) {
        rows.forEach((row, index) => {
          const mappedRow = {};
          for (const [key, value] of Object.entries(row)) {
            if (keyMap[key]) {
              mappedRow[keyMap[key]] = value != null ? value.toString() : "";
            }
          }
          worksheet.addRow(mappedRow);

          totalRows++;

          if (index % 10 === 0) { // Ajuste este valor conforme necessário
            event.sender.send('export-progress', totalRows, TOTAL);
          }
        });

        //totalRows += rows.length;
        event.sender.send('export-progress', totalRows, TOTAL);
      }
    } catch (err) {
      console.error(`Erro ao processar os dados: ${err.message}`);
      event.sender.send('export-error', err.message);
      fs.rmSync(tmpPath, { force: true });
      throw err;
    }

    if (totalRows === 0) {
      console.log("Nenhuma linha de dados foi processada.");
    }

    worksheet.getRow(1).font = { bold: true };

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    console.log(`Total de registros processados: ${totalRows}`);
    console.log(`Exportando ${totalRows} registros para o Excel...`);
    event.sender.send('export-saving', filePath);

    //await workbook.xlsx.writeFile(filePath);
    await workbook.commit();

    fs.renameSync(tmpPath, filePath);
    console.log(`Arquivo gerado em: ${filePath}`);
    event.sender.send('export-success', filePath);
    return filePath;
  } catch (err) {
    fs.rmSync(tmpPath, { force: true });
    const msg = isError(err) ? err.message : 'Erro desconhecido';
    event.sender.send('export-error', msg);
  } finally {
    db?.detach?.();
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

    const query = `SELECT COUNT(*) AS total FROM PRODUTO;`;

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

ipcMain.handle("cancel-export", async (event) => {
  const result = await dialog.showMessageBox({
    type: "warning",
    title: "Cancelar Exportação",
    message: "Você tem certeza que deseja cancelar a exportação?",
    buttons: ["Sim", "Não"],
  });

  if (result.response === 0) {
    event.sender.send("export-cancelled");
    return true;
  }
});

async function* fetchBatches(db, limit = 5000) {
  let offset = 0;
  const base = `${queryProductsBaseWithoutSG}`;

  while (true) {
    const sql = `${base} ROWS ${offset + 1} TO ${offset + limit}`;
    console.log("Lendo lote de ", offset + 1, " a ", offset + limit);
    console.log("SQL: ", sql);
    const rows = await queryPromise(db, sql);
    console.log("Lote lido: ", rows.length, " registros.");
    if (rows.length === 0) break;
    yield rows;
    offset += limit;
  }
}

function queryPromise(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, res) => (err ? reject(err) : resolve(res)));
  });
}