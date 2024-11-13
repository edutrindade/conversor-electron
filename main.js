import 'dotenv/config';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Firebird from 'node-firebird';
import fs from 'fs';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      //devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  let indexPath;

  if (app.isPackaged) {
    indexPath = path.join(__dirname, 'dist', 'index.html');
  }

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const dbOptions = {
  host: 'localhost',
  port: 3050,
  database: '',
  user: 'SYSDBA',
  password: 'masterkey',
  role: null,
  pageSize: 4096,
};

///Users/eduardotrindade/downloads/Resulth/RESULTH.FB

function connectToDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    const normalizedPath = path.normalize(dbPath);

    if (!fs.existsSync(normalizedPath)) {
      return reject(
        new Error(
          'Caminho inválido. Por favor, insira um caminho válido para o arquivo do banco de dados.'
        )
      );
    }

    console.log('Caminho do banco de dados:', normalizedPath);

    dbOptions.database = normalizedPath;

    console.log('Conectando ao banco de dados...', dbOptions);

    Firebird.attach(dbOptions, (err, db) => {
      if (err) {
        return reject(err);
      }
      console.log('Conexão estabelecida com sucesso!');
      resolve(db);
    });
  });
}

function exportToExcel(rows) {
  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos');

    worksheet.columns = [
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Descrição', key: 'descricao', width: 30 },
      { header: 'Referência', key: 'referencia', width: 20 },
      { header: 'Cód. Auxiliar', key: 'codAuxiliar', width: 20 },
      { header: 'Fornecedor', key: 'fornecedor', width: 30 },
      { header: 'Fornecedor exclusivo', key: 'fornecedorExclusivo', width: 30 },
      { header: 'Comprador', key: 'comprador', width: 30 },
      { header: 'Empresa', key: 'empresa', width: 30 },
      { header: 'Contabiliza saldo em estoque', key: 'contabilizaSaldo', width: 30 },
      { header: 'Indisponível para venda', key: 'indisponivelVenda', width: 30 },
      { header: 'Setor', key: 'setor', width: 30 },
      { header: 'Linha', key: 'linha', width: 30 },
      { header: 'Marca', key: 'marca', width: 30 },
      { header: 'Coleção', key: 'colecao', width: 30 },
      { header: 'Espessura', key: 'espessura', width: 30 },
      { header: 'Classificação', key: 'classificacao', width: 30 },
      { header: 'Tamanho', key: 'tamanho', width: 30 },
      { header: 'Cores', key: 'cores', width: 30 },
      { header: 'Unidade de venda', key: 'unidadeVenda', width: 30 },
      { header: 'Múltiplo de venda', key: 'multiploVenda', width: 30 },
      { header: 'Moeda', key: 'moeda', width: 30 },
      { header: 'Custo com ICMS (R$)', key: 'custoICMS', width: 30 },
      { header: 'Desconto (%)', key: 'desconto', width: 30 },
      { header: 'Acréscimo (%)', key: 'acrescimo', width: 30 },
      { header: 'IPI (%)', key: 'ipi', width: 30 },
      { header: 'Frete (R$)', key: 'frete', width: 30 },
      { header: 'Despesas acessórias (R$)', key: 'despesasAcessorias', width: 30 },
      { header: 'Substituição tributária (R$)', key: 'substituicaoTributaria', width: 30 },
      { header: 'Diferencial ICMS (R$)', key: 'diferencialICMS', width: 30 },
      { header: 'Mark-up (%)', key: 'markup', width: 30 },
      { header: 'Preço de venda R$', key: 'precoVenda', width: 30 },
      { header: 'Permite desconto', key: 'permiteDesconto', width: 30 },
      { header: 'Comissão %', key: 'comissao', width: 30 },
      { header: 'Configuração tributária', key: 'configuracaoTributaria', width: 30 },
      { header: 'NCM', key: 'ncm', width: 30 },
      { header: 'CEST', key: 'cest', width: 30 },
      { header: 'Produto supérfluo', key: 'produtoSuperfluo', width: 30 },
      { header: 'Tipo de item', key: 'tipoItem', width: 30 },
      { header: 'Origem da mercadoria', key: 'origemMercadoria', width: 30 },
      { header: 'Regime de Incidência PIS e COFINS', key: 'regimeIncidencia', width: 30 },
      { header: 'Produto é brinde', key: 'produtoBrinde', width: 30 },
      { header: 'Produto de catálogo', key: 'produtoCatalogo', width: 30 },
      { header: 'Descrição de catálogo', key: 'descricaoCatalogo', width: 30 },
      { header: 'Disponível na loja virtual', key: 'disponivelLojaVirtual', width: 30 },
      { header: 'Exige controle', key: 'exigeControle', width: 30 },
      { header: 'Tipo de controle', key: 'tipoControle', width: 30 },
      { header: 'Tamanho controle', key: 'tamanhoControle', width: 30 },
      { header: 'Peso bruto (kg)', key: 'pesoBruto', width: 30 },
      { header: 'Peso líquido (kg)', key: 'pesoLiquido', width: 30 },
      { header: 'Descrição complementar?', key: 'descricaoComplementar', width: 30 },
      { header: 'Altura (frete)', key: 'alturaFrete', width: 30 },
      { header: 'Largura (frete)', key: 'larguraFrete', width: 30 },
      { header: 'Comprimento (frete)', key: 'comprimentoFrete', width: 30 },
      { header: 'Altura', key: 'altura', width: 30 },
      { header: 'Largura', key: 'largura', width: 30 },
      { header: 'Comprimento', key: 'comprimento', width: 30 },
      { header: 'Importado por balança', key: 'importadoBalanca', width: 30 },
      { header: 'Quantidade mínima', key: 'quantidadeMinima', width: 30 },
      { header: 'Quantidade máxima', key: 'quantidadeMaxima', width: 30 },
      { header: 'Quantidade compra', key: 'quantidadeCompra', width: 30 },
      { header: 'Observação', key: 'observacao', width: 30 },
      { header: 'Código de barras', key: 'codigoBarras', width: 30 },
      { header: 'Características', key: 'caracteristicas', width: 30 },
    ];

    // Mapeamento das chaves do row para as chaves do worksheet
    const keyMap = {
      Código: 'codigo',
      Descrição: 'descricao',
      Referência: 'referencia',
      'Cód. Auxiliar': 'codAuxiliar',
      Fornecedor: 'fornecedor',
      'Fornecedor exclusivo': 'fornecedorExclusivo',
      Comprador: 'comprador',
      Empresa: 'empresa',
      'Contabiliza saldo em estoque': 'contabilizaSaldo',
      'Indisponível para venda': 'indisponivelVenda',
      Setor: 'setor',
      Linha: 'linha',
      Marca: 'marca',
      Coleção: 'colecao',
      Espessura: 'espessura',
      Classificação: 'classificacao',
      Tamanho: 'tamanho',
      Cores: 'cores',
      'Unidade de venda': 'unidadeVenda',
      'Múltiplo de venda': 'multiploVenda',
      Moeda: 'moeda',
      'Custo com ICMS (R$)': 'custoICMS',
      'Desconto (%)': 'desconto',
      'Acréscimo (%)': 'acrescimo',
      'IPI (%)': 'ipi',
      'Frete (R$)': 'frete',
      'Despesas acessórias (R$)': 'despesasAcessorias',
      'Substituição tributária (R$)': 'substituicaoTributaria',
      'Diferencial ICMS (R$)': 'diferencialICMS',
      'Mark-up (%)': 'markup',
      'Preço de venda R$': 'precoVenda',
      'Permite desconto': 'permiteDesconto',
      'Comissão %': 'comissao',
      'Configuração tributária': 'configuracaoTributaria',
      NCM: 'ncm',
      CEST: 'cest',
      'Produto supérfluo': 'produtoSuperfluo',
      'Tipo de item': 'tipoItem',
      'Origem da mercadoria': 'origemMercadoria',
      'Regime de Incidência PIS e COFINS': 'regimeIncidencia',
      'Produto é brinde': 'produtoBrinde',
      'Produto de catálogo': 'produtoCatalogo',
      'Descrição de catálogo': 'descricaoCatalogo',
      'Disponível na loja virtual': 'disponivelLojaVirtual',
      'Exige controle': 'exigeControle',
      'Tipo de controle': 'tipoControle',
      'Tamanho controle': 'tamanhoControle',
      'Peso bruto (kg)': 'pesoBruto',
      'Peso líquido (kg)': 'pesoLiquido',
      'Descrição complementar?': 'descricaoComplementar',
      'Altura (frete)': 'alturaFrete',
      'Largura (frete)': 'larguraFrete',
      'Comprimento (frete)': 'comprimentoFrete',
      Altura: 'altura',
      Largura: 'largura',
      Comprimento: 'comprimento',
      'Importado por balança': 'importadoBalanca',
      'Quantidade mínima': 'quantidadeMinima',
      'Quantidade máxima': 'quantidadeMaxima',
      'Quantidade compra': 'quantidadeCompra',
      Observação: 'observacao',
      'Código de barras': 'codigoBarras',
      Características: 'caracteristicas',
    };

    // Adicionar linhas ao arquivo Excel
    rows.forEach((row) => {
      const mappedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (keyMap[key]) {
          if (typeof value === 'function') {
            mappedRow[keyMap[key]] = '';
          } else {
            mappedRow[keyMap[key]] = value != null && value != undefined ? value?.toString() : '';
          }
        }
      }
      worksheet.addRow(mappedRow);
    });

    worksheet.getRow(1).font = { bold: true };

    // Ajustar a largura das colunas
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

    // Gerar o arquivo Excel em memória
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        console.log('Arquivo gerado em memória');
        resolve(buffer);
      })
      .catch((err) => {
        console.error('Erro ao gerar o arquivo:', err);
        reject(err);
      });
  });
}

ipcMain.handle('export-data', async (event, dbPath) => {
  try {
    const db = await connectToDatabase(dbPath);

    const query = `SELECT 
            '' AS "Código",
            p.DESCRICAO AS "Descrição",
            p.REFFABRICANTE AS "Referência",
            '' AS "Cód. Auxiliar",
            f.NOME AS "Fornecedor",
            '' AS "Fornecedor exclusivo",
            '' AS "Comprador",
            e.EMPRESA AS "Empresa",
            'SIM' AS "Contabiliza saldo em estoque",
            '' AS "Indisponível para venda",
            g.DESCRICAO AS "Setor",
            sg.DESCRICAO AS "Linha",
            '' AS "Marca",
            '' AS "Coleção",
            '' AS "Espessura",
            fam.DESCRICAO AS "Classificação",
            gr.DESCRICAO AS "Tamanho",
            '' AS "Cores",
            p.UNIDADESAIDA AS "Unidade de venda",
            p.FATORCONVERSAO AS "Múltiplo de venda",
            'R$' AS "Moeda",
            cp.PRECOCUSTO AS "Custo com ICMS (R$)",
            cp.DESCONTOPERC AS "Desconto (%)",
            '' AS "Acréscimo (%)",
            cp.ALIQIPI AS "IPI (%)",
            cp.FRETEVLR AS "Frete (R$)",
            '' AS "Despesas acessórias (R$)",
            '' AS "Substituição tributária (R$)",
            '' AS "Diferencial ICMS (R$)",
            '' AS "Mark-up (%)",
            p.PRECO AS "Preço de venda R$",
            'S' AS "Permite desconto",
            '' AS "Comissão %",
            '' AS "Configuração tributária",
            c.CODIGONCM AS "NCM",
            p.CODCEST AS "CEST",
            '' AS "Produto supérfluo",
            '' AS "Tipo de item",
            '' AS "Origem da mercadoria",
            '' AS "Regime de Incidência PIS e COFINS",
            '' AS "Produto é brinde",
            '' AS "Produto de catálogo",
            '' AS "Descrição de catálogo",
            '' AS "Disponível na loja virtual",
            '' AS "Exige controle",
            '' AS "Tipo de controle",
            '' AS "Tamanho controle",
            p.PESO AS "Peso bruto (kg)",
            '' AS "Peso líquido (kg)",
            '' AS "Descrição complementar?",
            '' AS "Altura (frete)",
            '' AS "Largura (frete)",
            '' AS "Comprimento (frete)",
            '' AS "Altura",
            '' AS "Largura",
            '' AS "Comprimento",
            '' AS "Importado por balança",
            p.ESTMINIMO AS "Quantidade mínima",
            p.ESTMAXIMO AS "Quantidade máxima",
            '' AS "Quantidade compra",
            p.OBSERVACAO AS "Observação",
            p.REFFABRICANTE AS "Código de barras",
            '' AS "Características"
        FROM 
            PRODUTO p
        LEFT JOIN 
            FORNECE f ON p.PRINCIPALFORNEC = f.CODFORNEC
        LEFT JOIN 
            CLASFISC c ON p.CODCLASFIS = c.CODCLASFIS
        LEFT JOIN 
            GRUPROD g ON p.CODGRUPO = g.CODGRUPO
        LEFT JOIN 
            SUBGRUP sg ON p.CODSUBGRUPO = sg.CODSUBGRUPO
        LEFT JOIN 
            COMPPROD cp ON p.CODPROD = cp.CODPROD
        LEFT JOIN 
            GRADE gr ON cp.CODGRADE = gr.CODGRADE
        LEFT JOIN 
            FAMILIA fam ON p.CODFAMILIA = fam.CODIGO
        LEFT JOIN 
            EMPRESA e ON 1=1  -- Este JOIN continua como está, pois você assume que sempre há uma empresa
        WHERE 
            p.ATIVO = 'S';`;

    db.query(query, async (err, result) => {
      if (err) {
        db.detach();
        event.sender.send('export-error', err.message);
        return;
      }

      if (!result.length) {
        db.detach();
        event.sender.send('export-error', 'Nenhum registro encontrado para exportar.');
        return;
      }

      console.log(`Exportando ${result.length} registros para o Excel...`);

      try {
        const buffer = await exportToExcel(result);

        let currentRow = 0;
        const totalRows = result.length;

        result.forEach(() => {
          currentRow++;
          const progress = Math.round((currentRow / totalRows) * 100);
          event.sender.send('export-progress', { current: currentRow, total: totalRows, progress });
        });

        db.detach();
        event.sender.send('export-success', buffer);
      } catch (exportError) {
        db.detach();
        event.sender.send('export-error', exportError.message);
      }
    });
  } catch (error) {
    console.error(`Erro ao processar: ${error.message}`);
    event.sender.send('export-error', error.message);
  }
});

ipcMain.handle('select-database', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Firebird Databases', extensions: ['fb'] }],
  });

  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});

ipcMain.handle('get-total-rows', async (_event, dbPath) => {
  try {
    const db = await connectToDatabase(dbPath);

    const query = `SELECT COUNT(*) AS total FROM PRODUTO WHERE ATIVO = 'S';`;

    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        db.detach();
        if (err) {
          reject(err);
        } else {
          resolve(result[0].total);
        }
      });
    });
  } catch (error) {
    console.error(`Erro ao contar linhas: ${error.message}`);
    throw error;
  }
});
