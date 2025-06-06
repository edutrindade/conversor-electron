export function createProductColumns() {
    return [
        { header: "Código", key: "codigo", width: 15 },
        { header: "Descrição", key: "descricao", width: 30 },
        { header: "Referência", key: "referencia", width: 20 },
        { header: "Cód. Auxiliar", key: "codAuxiliar", width: 20 },
        { header: "Fornecedor", key: "fornecedor", width: 30 },
        { header: "Fornecedor exclusivo", key: "fornecedorExclusivo", width: 30 },
        { header: "Comprador", key: "comprador", width: 30 },
        { header: "Empresa", key: "empresa", width: 30 },
        {
            header: "Contabiliza saldo em estoque",
            key: "contabilizaSaldo",
            width: 30,
        },
        {
            header: "Indisponível para venda",
            key: "indisponivelVenda",
            width: 30,
        },
        { header: "Setor", key: "setor", width: 30 },
        { header: "Linha", key: "linha", width: 30 },
        { header: "Marca", key: "marca", width: 30 },
        { header: "Coleção", key: "colecao", width: 30 },
        { header: "Espessura", key: "espessura", width: 30 },
        { header: "Classificação", key: "classificacao", width: 30 },
        { header: "Tamanho", key: "tamanho", width: 30 },
        { header: "Cores", key: "cores", width: 30 },
        { header: "Unidade de venda", key: "unidadeVenda", width: 30 },
        { header: "Múltiplo de venda", key: "multiploVenda", width: 30 },
        { header: "Moeda", key: "moeda", width: 30 },
        { header: "Custo com ICMS (R$)", key: "custoICMS", width: 30 },
        { header: "Desconto (%)", key: "desconto", width: 30 },
        { header: "Acréscimo (%)", key: "acrescimo", width: 30 },
        { header: "IPI (%)", key: "ipi", width: 30 },
        { header: "Frete (R$)", key: "frete", width: 30 },
        {
            header: "Despesas acessórias (R$)",
            key: "despesasAcessorias",
            width: 30,
        },
        {
            header: "Substituição tributária (R$)",
            key: "substituicaoTributaria",
            width: 30,
        },
        { header: "Diferencial ICMS (R$)", key: "diferencialICMS", width: 30 },
        { header: "Mark-up (%)", key: "markup", width: 30 },
        { header: "Preço de venda R$", key: "precoVenda", width: 30 },
        { header: "Permite desconto", key: "permiteDesconto", width: 30 },
        { header: "Comissão %", key: "comissao", width: 30 },
        {
            header: "Configuração tributária",
            key: "configuracaoTributaria",
            width: 30,
        },
        { header: "NCM", key: "ncm", width: 30 },
        { header: "CEST", key: "cest", width: 30 },
        { header: "Produto supérfluo", key: "produtoSuperfluo", width: 30 },
        { header: "Tipo de item", key: "tipoItem", width: 30 },
        { header: "Origem da mercadoria", key: "origemMercadoria", width: 30 },
        {
            header: "Regime de Incidência PIS e COFINS",
            key: "regimeIncidencia",
            width: 30,
        },
        { header: "Produto é brinde", key: "produtoBrinde", width: 30 },
        { header: "Produto de catálogo", key: "produtoCatalogo", width: 30 },
        { header: "Descrição de catálogo", key: "descricaoCatalogo", width: 30 },
        {
            header: "Disponível na loja virtual",
            key: "disponivelLojaVirtual",
            width: 30,
        },
        { header: "Exige controle", key: "exigeControle", width: 30 },
        { header: "Tipo de controle", key: "tipoControle", width: 30 },
        { header: "Tamanho controle", key: "tamanhoControle", width: 30 },
        { header: "Peso bruto (kg)", key: "pesoBruto", width: 30 },
        { header: "Peso líquido (kg)", key: "pesoLiquido", width: 30 },
        {
            header: "Descrição complementar?",
            key: "descricaoComplementar",
            width: 30,
        },
        { header: "Altura (frete)", key: "alturaFrete", width: 30 },
        { header: "Largura (frete)", key: "larguraFrete", width: 30 },
        { header: "Comprimento (frete)", key: "comprimentoFrete", width: 30 },
        { header: "Altura", key: "altura", width: 30 },
        { header: "Largura", key: "largura", width: 30 },
        { header: "Comprimento", key: "comprimento", width: 30 },
        { header: "Importado por balança", key: "importadoBalanca", width: 30 },
        {
            header: "Produto vendido por (balança)",
            key: "vendidoBalanca",
            width: 30,
        },
        { header: "Quantidade mínima", key: "quantidadeMinima", width: 30 },
        { header: "Quantidade máxima", key: "quantidadeMaxima", width: 30 },
        { header: "Quantidade compra", key: "quantidadeCompra", width: 30 },
        { header: "Observação", key: "observacao", width: 30 },
        { header: "Código de barras", key: "codigoBarras", width: 30 },
        { header: "Características", key: "caracteristicas", width: 30 },
        { header: "Status", key: "status", width: 30 },
    ];
}
