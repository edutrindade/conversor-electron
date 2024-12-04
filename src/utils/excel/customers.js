import ExcelJS from "exceljs";

export function exportCustomersToExcel(rows) {
  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clientes");

    worksheet.columns = [
      { header: "CPF/CNPJ", key: "cpfCnpj", width: 20 },
      { header: "Nome/Razão Social", key: "nomeRazaoSocial", width: 30 },
      { header: "Nome Fantasia", key: "nomeFantasia", width: 30 },
      { header: "Tipo", key: "tipo", width: 10 },
      { header: "Data de Nascimento", key: "dataNascimento", width: 15 },
      { header: "Sexo", key: "sexo", width: 10 },
      { header: "Estado civil", key: "estadoCivil", width: 15 },
      { header: "Nome do Cônjuge", key: "nomeConjuge", width: 30 },
      { header: "CEP", key: "cep", width: 10 },
      { header: "Endereço", key: "endereco", width: 30 },
      { header: "Número", key: "numero", width: 10 },
      { header: "Complemento", key: "complemento", width: 20 },
      { header: "Bairro", key: "bairro", width: 20 },
      { header: "Cidade", key: "cidade", width: 20 },
      { header: "UF", key: "uf", width: 5 },
      { header: "País", key: "pais", width: 15 },
      { header: "Telefone", key: "telefone", width: 15 },
      { header: "Celular", key: "celular", width: 15 },
      { header: "E-mail", key: "email", width: 30 },
      { header: "Inscrição Estadual", key: "inscricaoEstadual", width: 20 },
      { header: "Identidade/RG", key: "identidadeRg", width: 20 },
      { header: "Data de Emissão RG", key: "dataEmissaoRg", width: 15 },
      { header: "Órgão Emissor RG", key: "orgaoEmissorRg", width: 20 },
      { header: "Classe", key: "classe", width: 15 },
      { header: "Subclasse", key: "subclasse", width: 15 },
      { header: "Faturamento liberado", key: "faturamentoLiberado", width: 20 },
      {
        header: "Motivo do Bloqueio do Faturamento",
        key: "motivoBloqueioFaturamento",
        width: 30,
      },
      {
        header: "Limite de Crédito (Crediário)",
        key: "limiteCredito",
        width: 20,
      },
      { header: "Cadastro Desativado", key: "cadastroDesativado", width: 20 },
      { header: "Cliente Anônimo (LGPD)", key: "clienteAnonimo", width: 20 },
      { header: "Observação", key: "observacao", width: 30 },
      {
        header: "Aceita programa fidelidade",
        key: "aceitaProgramaFidelidade",
        width: 20,
      },
      { header: "Conveniador", key: "conveniador", width: 20 },
      { header: "Matrícula conveniado", key: "matriculaConveniado", width: 20 },
      { header: "Limite convênio ($)", key: "limiteConvenio", width: 20 },
      {
        header: "Dia fechamento convênio",
        key: "diaFechamentoConvenio",
        width: 20,
      },
      {
        header: "Dia cobrança convênio",
        key: "diaCobrancaConvenio",
        width: 20,
      },
      { header: "Bloquear conveniado", key: "bloquearConveniado", width: 20 },
      { header: "É Transportador", key: "eTransportador", width: 15 },
    ];

    const keyMap = {
      "CPF/CNPJ": "cpfCnpj",
      "Nome/Razão Social": "nomeRazaoSocial",
      "Nome Fantasia": "nomeFantasia",
      Tipo: "tipo",
      "Data de Nascimento": "dataNascimento",
      Sexo: "sexo",
      "Estado civil": "estadoCivil",
      "Nome do Cônjuge": "nomeConjuge",
      CEP: "cep",
      Endereço: "endereco",
      Número: "numero",
      Complemento: "complemento",
      Bairro: "bairro",
      Cidade: "cidade",
      UF: "uf",
      País: "pais",
      Telefone: "telefone",
      Celular: "celular",
      "E-mail": "email",
      "Inscrição Estadual": "inscricaoEstadual",
      "Identidade/RG": "identidadeRg",
      "Data de Emissão RG": "dataEmissaoRg",
      "Órgão Emissor RG": "orgaoEmissorRg",
      Classe: "classe",
      Subclasse: "subclasse",
      "Faturamento liberado": "faturamentoLiberado",
      "Motivo do Bloqueio do Faturamento": "motivoBloqueioFaturamento",
      "Limite de Crédito (Crediário)": "limiteCredito",
      "Cadastro Desativado": "cadastroDesativado",
      "Cliente Anônimo (LGPD)": "clienteAnonimo",
      Observação: "observacao",
      "Aceita programa fidelidade": "aceitaProgramaFidelidade",
      Conveniador: "conveniador",
      "Matrícula conveniado": "matriculaConveniado",
      "Limite convênio ($)": "limiteConvenio",
      "Dia fechamento convênio": "diaFechamentoConvenio",
      "Dia cobrança convênio": "diaCobrancaConvenio",
      "Bloquear conveniado": "bloquearConveniado",
      "É Transportador": "eTransportador",
    };

    rows.forEach((row) => {
      const mappedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (keyMap[key]) {
          mappedRow[keyMap[key]] = value != null ? value.toString() : "";
        }
      }
      const excelRow = worksheet.addRow(mappedRow);

       // Estiliza a célula se o CPF foi gerado
       if (row.isGenerated) {
        const cell = excelRow.getCell('cpfCnpj');
        cell.font = { color: { argb: 'FFFF0000' } }; // Define a cor da fonte como vermelha
      }
    });

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

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        console.log("Arquivo gerado em memória");
        resolve(buffer);
      })
      .catch((err) => {
        console.error("Erro ao gerar o arquivo:", err);
        reject(err);
      });
  });
}
