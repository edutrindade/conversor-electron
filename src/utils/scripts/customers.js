export const queryCustomers = `SELECT
    c.CGCCPF AS "CPF/CNPJ",
    c.NOME AS "Nome/Razão Social",
    c.NOMEFANTASIA AS "Nome Fantasia",
    'C' AS "Tipo", 
    c.DT_NASCIMENTO AS "Data de Nascimento",
    '' AS "Sexo",
    '' AS "Estado civil",
    '' AS "Nome do Cônjuge",
    c.CEP AS "CEP",
    c.ENDERECO AS "Endereço",
    COALESCE(c.NUMERO, '') AS "Número",
    COALESCE(c.COMPLEMENTO, '') AS "Complemento",
    c.BAIRRO AS "Bairro",
    ci.CIDADE AS "Cidade",
    c.ESTADO AS "UF",
    COALESCE(p.NOMEPAIS, 'BRASIL') AS "País",
    c.FONE AS "Telefone",
    c.CELULAR AS "Celular",
    c.EMAIL AS "E-mail",
    c.INSCEST AS "Inscrição Estadual",
    '' AS "Identidade/RG",
    '' AS "Data de Emissão RG",
    '' AS "Órgão Emissor RG",
    '' AS "Classe",
    '' AS "Subclasse",
    '' AS "Faturamento liberado",
    '' AS "Motivo do Bloqueio do Faturamento",
    c.LIMITECREDITO AS "Limite de Crédito (Crediário)",
    CASE WHEN c.ATIVO = 'S' THEN 'N' ELSE 'S' END AS "Cadastro Desativado",
    '' AS "Cliente Anônimo (LGPD)",
    c.OBSERVACAO AS "Observação",
    '' AS "Aceita programa fidelidade",
    '' AS "Conveniador",
    '' AS "Matrícula conveniado",
    '' AS "Limite convênio ($)",
    '' AS "Dia fechamento convênio",
    '' AS "Dia cobrança convênio",
    '' AS "Bloquear conveniado",
    'N' AS "É Transportador"
FROM
    CLIENTE c
JOIN
    CIDADES ci ON c.CODCIDADE = ci.CODCIDADE
LEFT JOIN
    PAISES p ON c.CODPAIS = p.CODPAIS

UNION ALL

SELECT
    f.CGCCPF AS "CPF/CNPJ",
    f.NOME AS "Nome/Razão Social",
    f.NOMEFANTASIA AS "Nome Fantasia",
    'F' AS "Tipo", 
    '' AS "Data de Nascimento",
    '' AS "Sexo",
    '' AS "Estado civil",
    '' AS "Nome do Cônjuge",
    f.CEP AS "CEP",
    f.ENDERECO AS "Endereço",
    COALESCE(f.NUMERO, '') AS "Número",
    COALESCE(f.COMPLEMENTO, '') AS "Complemento",
    f.BAIRRO AS "Bairro",
    ci.CIDADE AS "Cidade",
    f.ESTADO AS "UF",
    'BRASIL' AS "País",
    f.FONE AS "Telefone",
    f.CELULAR AS "Celular",
    f.EMAIL AS "E-mail",
    f.INSCEST AS "Inscrição Estadual",
    '' AS "Identidade/RG",
    '' AS "Data de Emissão RG",
    '' AS "Órgão Emissor RG",
    '' AS "Classe",
    '' AS "Subclasse",
    '' AS "Faturamento liberado",
    '' AS "Motivo do Bloqueio do Faturamento",
    '' AS "Limite de Crédito (Crediário)",
    CASE WHEN f.ATIVO = 'S' THEN 'N' ELSE 'S' END AS "Cadastro Desativado", -- Corrigido
    '' AS "Cliente Anônimo (LGPD)",
    f.OBSERVACAO AS "Observação",
    '' AS "Aceita programa fidelidade",
    '' AS "Conveniador",
    '' AS "Matrícula conveniado",
    '' AS "Limite convênio ($)",
    '' AS "Dia fechamento convênio",
    '' AS "Dia cobrança convênio",
    '' AS "Bloquear conveniado",
    'N' AS "É Transportador"
FROM
    FORNECE f
JOIN
    CIDADES ci ON f.CODCIDADE = ci.CODCIDADE

UNION ALL

SELECT
    t.CGCCPF AS "CPF/CNPJ",
    t.NOME AS "Nome/Razão Social",
    '' AS "Nome Fantasia",
    'T' AS "Tipo", 
    '' AS "Data de Nascimento",
    '' AS "Sexo",
    '' AS "Estado civil",
    '' AS "Nome do Cônjuge",
    t.CEP AS "CEP",
    t.ENDERECO AS "Endereço",
    COALESCE(t.NUMERO, '') AS "Número",
    '' AS "Complemento", 
    t.BAIRRO AS "Bairro",
    ci.CIDADE AS "Cidade",
    t.ESTADO AS "UF",
    'BRASIL' AS "País",
    t.FONE AS "Telefone",
    '' AS "Celular",
    t.EMAIL AS "E-mail",
    t.INSCEST AS "Inscrição Estadual",
    '' AS "Identidade/RG",
    '' AS "Data de Emissão RG",
    '' AS "Órgão Emissor RG",
    '' AS "Classe",
    '' AS "Subclasse",
    '' AS "Faturamento liberado",
    '' AS "Motivo do Bloqueio do Faturamento",
    '' AS "Limite de Crédito (Crediário)",
    'N' AS "Cadastro Desativado", -- Transportadores não têm essa lógica
    '' AS "Cliente Anônimo (LGPD)",
    t.OBSERVACAO AS "Observação",
    '' AS "Aceita programa fidelidade",
    '' AS "Conveniador",
    '' AS "Matrícula conveniado",
    '' AS "Limite convênio ($)",
    '' AS "Dia fechamento convênio",
    '' AS "Dia cobrança convênio",
    '' AS "Bloquear conveniado",
    'S' AS "É Transportador"
FROM
    TRANSPT t
JOIN
    CIDADES ci ON t.CODCIDADE = ci.CODCIDADE;
`;
