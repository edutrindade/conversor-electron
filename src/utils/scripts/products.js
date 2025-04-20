export const queryProducts = `SELECT 
            p.CODPROD AS "Código",
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
            COALESCE(pg.PRECOGRADE, p.PRECO) AS "Preço de venda R$",
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
            '' AS "Produto vendido por (balança)",
            p.ESTMINIMO AS "Quantidade mínima",
            p.ESTMAXIMO AS "Quantidade máxima",
            '' AS "Quantidade compra",
            p.OBSERVACAO AS "Observação",
            COALESCE(pg.CODBARRA, p.REFERENCIA) AS "Código de barras",
            '' AS "Características",
            '1' AS "Status"
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
        LEFT JOIN 
            PRODGRADE pg ON p.CODPROD = pg.CODPROD AND cp.CODGRADE = pg.CODGRADE   
        WHERE 
            p.ATIVO = 'S';`;

export const queryProductsBase = `SELECT DISTINCT
            p.CODPROD AS "Código",
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
            COALESCE(pg.PRECOGRADE, p.PRECO) AS "Preço de venda R$",
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
            '' AS "Produto vendido por (balança)",
            p.ESTMINIMO AS "Quantidade mínima",
            p.ESTMAXIMO AS "Quantidade máxima",
            '' AS "Quantidade compra",
            '' AS "Observação",
            COALESCE(pg.CODBARRA, p.REFERENCIA) AS "Código de barras",
            '' AS "Características",
            '1' AS "Status"
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
        LEFT JOIN 
            PRODGRADE pg ON p.CODPROD = pg.CODPROD AND cp.CODGRADE = pg.CODGRADE   
        WHERE 
            p.ATIVO = 'S'
        ORDER BY 
            p.CODPROD`;







// export const queryProductsBase = `
//     WITH ProdutosBase AS (
//     SELECT DISTINCT
//         p.CODPROD
//     FROM
//         PRODUTO p
//     WHERE
//         p.ATIVO = 'S'
// )
// SELECT DISTINCT
//    p.CODPROD AS "Código",
//             p.DESCRICAO AS "Descrição",
//             p.REFFABRICANTE AS "Referência",
//             '' AS "Cód. Auxiliar",
//             f.NOME AS "Fornecedor",
//             '' AS "Fornecedor exclusivo",
//             '' AS "Comprador",
//             e.EMPRESA AS "Empresa",
//             'SIM' AS "Contabiliza saldo em estoque",
//             '' AS "Indisponível para venda",
//             g.DESCRICAO AS "Setor",
//             sg.DESCRICAO AS "Linha",
//             '' AS "Marca",
//             '' AS "Coleção",
//             '' AS "Espessura",
//             fam.DESCRICAO AS "Classificação",
//             gr.DESCRICAO AS "Tamanho",
//             '' AS "Cores",
//             p.UNIDADESAIDA AS "Unidade de venda",
//             p.FATORCONVERSAO AS "Múltiplo de venda",
//             'R$' AS "Moeda",
//             cp.PRECOCUSTO AS "Custo com ICMS (R$)",
//             cp.DESCONTOPERC AS "Desconto (%)",
//             '' AS "Acréscimo (%)",
//             cp.ALIQIPI AS "IPI (%)",
//             cp.FRETEVLR AS "Frete (R$)",
//             '' AS "Despesas acessórias (R$)",
//             '' AS "Substituição tributária (R$)",
//             '' AS "Diferencial ICMS (R$)",
//             '' AS "Mark-up (%)",
//             COALESCE(pg.PRECOGRADE, p.PRECO) AS "Preço de venda R$",
//             'S' AS "Permite desconto",
//             '' AS "Comissão %",
//             '' AS "Configuração tributária",
//             c.CODIGONCM AS "NCM",
//             p.CODCEST AS "CEST",
//             '' AS "Produto supérfluo",
//             '' AS "Tipo de item",
//             '' AS "Origem da mercadoria",
//             '' AS "Regime de Incidência PIS e COFINS",
//             '' AS "Produto é brinde",
//             '' AS "Produto de catálogo",
//             '' AS "Descrição de catálogo",
//             '' AS "Disponível na loja virtual",
//             '' AS "Exige controle",
//             '' AS "Tipo de controle",
//             '' AS "Tamanho controle",
//             p.PESO AS "Peso bruto (kg)",
//             '' AS "Peso líquido (kg)",
//             '' AS "Descrição complementar?",
//             '' AS "Altura (frete)",
//             '' AS "Largura (frete)",
//             '' AS "Comprimento (frete)",
//             '' AS "Altura",
//             '' AS "Largura",
//             '' AS "Comprimento",
//             '' AS "Importado por balança",
//             '' AS "Produto vendido por (balança)",
//             p.ESTMINIMO AS "Quantidade mínima",
//             p.ESTMAXIMO AS "Quantidade máxima",
//             '' AS "Quantidade compra",
//             p.OBSERVACAO AS "Observação",
//             COALESCE(pg.CODBARRA, p.REFERENCIA) AS "Código de barras",
//             '' AS "Características",
//             '1' AS "Status"
// FROM
//     ProdutosBase pb
// JOIN
//     PRODUTO p ON pb.CODPROD = p.CODPROD
// LEFT JOIN
//     FORNECE f ON p.PRINCIPALFORNEC = f.CODFORNEC
// LEFT JOIN
//     CLASFISC c ON p.CODCLASFIS = c.CODCLASFIS
// LEFT JOIN
//     GRUPROD g ON p.CODGRUPO = g.CODGRUPO
// LEFT JOIN
//     SUBGRUP sg ON p.CODSUBGRUPO = sg.CODSUBGRUPO
// LEFT JOIN
//     COMPPROD cp ON p.CODPROD = cp.CODPROD
// LEFT JOIN
//     GRADE gr ON cp.CODGRADE = gr.CODGRADE
// LEFT JOIN
//     FAMILIA fam ON p.CODFAMILIA = fam.CODIGO
// LEFT JOIN
//     EMPRESA e ON 1=1
// LEFT JOIN
//     PRODGRADE pg ON p.CODPROD = pg.CODPROD AND cp.CODGRADE = pg.CODGRADE
// WHERE
//     p.ATIVO = 'S'
// ORDER BY
//     p.CODPROD;
// `;