import{j as e}from"./index-BreI0dyu.js";import{P as i,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as s}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function n(){return e.jsxs(i,{title:"Queries avançadas — JOINs, subqueries e CTEs",subtitle:"Os SELECTs que separam o iniciante do dev sênior. JOIN correto, GROUP BY, window functions, CTE recursivas e quando preferir cada um.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"SQL básico (SELECT, WHERE, ORDER BY). Saber o que é uma chave primária e estrangeira. MariaDB 10.2+ para CTE e window functions."}),e.jsx("h2",{children:"JOINs — explicação visual"}),e.jsx(a,{title:"Tabelas exemplo",language:"sql",code:`-- usuarios
-- 1 Maria, 2 João, 3 Pedro

-- pedidos
-- p1 user_id=1 valor=100
-- p2 user_id=1 valor=200
-- p3 user_id=2 valor=50`}),e.jsx(a,{language:"sql",code:`-- INNER JOIN: só quem tem em ambos
SELECT u.nome, p.valor
  FROM usuarios u
  INNER JOIN pedidos p ON p.user_id = u.id;
-- Maria 100, Maria 200, João 50

-- LEFT JOIN: tudo da esquerda + match da direita (NULL se não tem)
SELECT u.nome, p.valor
  FROM usuarios u
  LEFT JOIN pedidos p ON p.user_id = u.id;
-- Maria 100, Maria 200, João 50, Pedro NULL

-- RIGHT JOIN: tudo da direita + match da esquerda. Raro — prefira inverter o LEFT.

-- FULL OUTER: MariaDB não tem nativo; emule com UNION
SELECT u.nome, p.valor FROM usuarios u LEFT JOIN pedidos p ON p.user_id=u.id
UNION
SELECT u.nome, p.valor FROM usuarios u RIGHT JOIN pedidos p ON p.user_id=u.id;

-- CROSS JOIN: produto cartesiano (multiplicação) — use só com propósito
SELECT t.cor, t.tamanho FROM cores t CROSS JOIN tamanhos;`}),e.jsx("h2",{children:"Achar quem NÃO tem (anti-join)"}),e.jsx(a,{language:"sql",code:`-- Usuários sem pedido — três formas equivalentes
-- 1) LEFT JOIN + IS NULL  (mais portável)
SELECT u.* FROM usuarios u
  LEFT JOIN pedidos p ON p.user_id = u.id
 WHERE p.id IS NULL;

-- 2) NOT EXISTS (frequentemente o mais rápido)
SELECT u.* FROM usuarios u
 WHERE NOT EXISTS (SELECT 1 FROM pedidos WHERE user_id = u.id);

-- 3) NOT IN  (cuidado com NULLs! Se subquery devolver NULL, vira sempre falso)
SELECT u.* FROM usuarios u
 WHERE u.id NOT IN (SELECT user_id FROM pedidos WHERE user_id IS NOT NULL);`}),e.jsx("h2",{children:"GROUP BY e funções de agregação"}),e.jsx(a,{language:"sql",code:`SELECT u.id, u.nome,
       COUNT(p.id)        AS total_pedidos,
       COALESCE(SUM(p.valor), 0) AS total_gasto,
       AVG(p.valor)       AS ticket_medio,
       MIN(p.criado_em)   AS primeiro_pedido,
       MAX(p.criado_em)   AS ultimo_pedido
  FROM usuarios u
  LEFT JOIN pedidos p ON p.user_id = u.id
 GROUP BY u.id, u.nome
 HAVING total_gasto > 500
 ORDER BY total_gasto DESC;`}),e.jsxs("p",{children:[e.jsx("strong",{children:"WHERE"})," filtra antes do GROUP BY (linhas individuais). ",e.jsx("strong",{children:"HAVING"})," ","filtra depois (sobre os grupos)."]}),e.jsx(s,{title:"Funções de agregação úteis",params:[{flag:"COUNT(*)",desc:"Conta linhas (incluindo NULL)."},{flag:"COUNT(coluna)",desc:"Conta apenas valores não-nulos."},{flag:"COUNT(DISTINCT coluna)",desc:"Conta valores únicos."},{flag:"SUM / AVG / MIN / MAX",desc:"Padrão."},{flag:"GROUP_CONCAT(coluna)",desc:"Concatena os valores do grupo separados por vírgula."},{flag:"JSON_ARRAYAGG(coluna)",desc:"Devolve array JSON dos valores (MariaDB 10.5+)."}]}),e.jsx("h2",{children:"Subqueries"}),e.jsx(a,{language:"sql",code:`-- Escalar (1 valor)
SELECT nome FROM produtos
 WHERE preco > (SELECT AVG(preco) FROM produtos);

-- Lista
SELECT * FROM produtos
 WHERE categoria_id IN (SELECT id FROM categorias WHERE ativa = 1);

-- Correlacionada (referencia tabela externa)
SELECT u.nome,
       (SELECT COUNT(*) FROM pedidos p WHERE p.user_id = u.id) AS total
  FROM usuarios u;

-- Derivada (FROM com SELECT)
SELECT t.tier, AVG(t.gasto) AS media
  FROM (SELECT user_id, SUM(valor) AS gasto FROM pedidos GROUP BY user_id) t
  JOIN usuarios u ON u.id = t.user_id
 GROUP BY t.tier;`}),e.jsx("h2",{children:"CTE — Common Table Expressions"}),e.jsx("p",{children:'CTEs deixam queries grandes legíveis. Pense como "variáveis temporárias de query".'}),e.jsx(a,{language:"sql",code:`WITH gastos AS (
    SELECT user_id, SUM(valor) AS total
      FROM pedidos
     WHERE pago_em >= '2026-01-01'
     GROUP BY user_id
),
top10 AS (
    SELECT * FROM gastos ORDER BY total DESC LIMIT 10
)
SELECT u.nome, t.total
  FROM top10 t
  JOIN usuarios u ON u.id = t.user_id;`}),e.jsx("h2",{children:"CTE recursiva — hierarquia"}),e.jsx(a,{title:"Tabela com chefia auto-referente",language:"sql",code:`WITH RECURSIVE arvore AS (
    -- âncora: o CEO
    SELECT id, nome, gerente_id, 0 AS nivel
      FROM funcionarios
     WHERE gerente_id IS NULL

    UNION ALL

    -- recursão: quem responde para alguém que já está na árvore
    SELECT f.id, f.nome, f.gerente_id, a.nivel + 1
      FROM funcionarios f
      JOIN arvore a ON a.id = f.gerente_id
)
SELECT REPEAT('  ', nivel) || nome AS hierarquia, nivel FROM arvore
 ORDER BY nivel, nome;`}),e.jsx("h2",{children:"Window functions"}),e.jsx("p",{children:'Calculam algo "ao redor" de cada linha sem agrupar — mantém o detalhe.'}),e.jsx(a,{language:"sql",code:`-- Ranking de produtos por categoria
SELECT
    nome,
    categoria_id,
    preco,
    ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY preco DESC) AS posicao,
    RANK()       OVER (PARTITION BY categoria_id ORDER BY preco DESC) AS rank,
    DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY preco DESC) AS dense_rank
  FROM produtos;

-- Acumulado de vendas no ano
SELECT
    DATE_FORMAT(criado_em, '%Y-%m') AS mes,
    SUM(valor) AS mes_total,
    SUM(SUM(valor)) OVER (ORDER BY DATE_FORMAT(criado_em, '%Y-%m')) AS acumulado
  FROM pedidos
 WHERE YEAR(criado_em) = 2026
 GROUP BY mes
 ORDER BY mes;

-- Diferença com o anterior
SELECT
    mes,
    total,
    LAG(total)  OVER (ORDER BY mes) AS mes_anterior,
    total - LAG(total) OVER (ORDER BY mes) AS variacao
  FROM resumo_mensal;`}),e.jsx(s,{title:"Window functions mais úteis",params:[{flag:"ROW_NUMBER()",desc:"Numera 1..N. Empates ganham números diferentes."},{flag:"RANK()",desc:"Empates dividem o mesmo número, próximo pula."},{flag:"DENSE_RANK()",desc:"Empates dividem; próximo continua sem pular."},{flag:"LAG(col, n)",desc:"Valor da linha N posições antes."},{flag:"LEAD(col, n)",desc:"Valor da linha N posições depois."},{flag:"FIRST_VALUE / LAST_VALUE",desc:"Primeiro/último da janela."},{flag:"SUM/AVG OVER",desc:"Acumulado, média móvel, etc."},{flag:"NTILE(n)",desc:"Divide em N grupos (quartis, decis)."}]}),e.jsx("h2",{children:"UPSERT — INSERT ... ON DUPLICATE KEY"}),e.jsx(a,{language:"sql",code:`-- Tabela com UNIQUE em (produto_id, dia)
INSERT INTO contadores (produto_id, dia, total)
VALUES (42, CURDATE(), 1)
    ON DUPLICATE KEY UPDATE total = total + 1;

-- Equivalente moderno (MariaDB 10.3+)
INSERT INTO contadores (produto_id, dia, total)
VALUES (42, CURDATE(), 1) AS novo
    ON DUPLICATE KEY UPDATE total = contadores.total + novo.total;

-- INSERT IGNORE — se chave duplicada, descarta
INSERT IGNORE INTO usuarios (email, nome) VALUES ('a@b.com', 'A');

-- REPLACE — DELETE + INSERT (perigoso com FKs)
REPLACE INTO config (chave, valor) VALUES ('logo', 'novo.png');`}),e.jsx("h2",{children:"Transações"}),e.jsx(a,{language:"sql",code:`START TRANSACTION;
    UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
    UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

    -- Validação
    IF (SELECT saldo FROM contas WHERE id = 1) < 0 THEN
        ROLLBACK;
    ELSE
        COMMIT;
    END IF;

-- Isolation levels (do menos para o mais estrito)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE
-- Padrão InnoDB: REPEATABLE READ`}),e.jsx("h2",{children:"Receitas práticas"}),e.jsx("h3",{children:"Top N por categoria"}),e.jsx(a,{language:"sql",code:`SELECT * FROM (
    SELECT p.*,
           ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY vendas DESC) AS rn
      FROM produtos p
) t WHERE rn <= 3;`}),e.jsx("h3",{children:"Pivot (linhas → colunas)"}),e.jsx(a,{language:"sql",code:`SELECT
    DATE_FORMAT(criado_em, '%Y-%m') AS mes,
    SUM(CASE WHEN tipo = 'A' THEN valor END) AS tipo_a,
    SUM(CASE WHEN tipo = 'B' THEN valor END) AS tipo_b,
    SUM(CASE WHEN tipo = 'C' THEN valor END) AS tipo_c
  FROM movimentos
 GROUP BY mes;`}),e.jsx("h3",{children:"Detectar duplicatas"}),e.jsx(a,{language:"sql",code:`SELECT email, COUNT(*) c
  FROM usuarios
 GROUP BY email
 HAVING c > 1;`}),e.jsxs(o,{type:"warning",title:"ORDER BY RAND() não escala",children:['Para "linha aleatória", evite ',e.jsx("code",{children:"ORDER BY RAND() LIMIT 1"})," em tabelas grandes — é full scan. Prefira ",e.jsx("code",{children:"WHERE id >= FLOOR(RAND() * MAX(id)) LIMIT 1"}),"."]}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"NOT IN"})," com NULL na subquery → resultado vazio inesperado."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"JOIN sem ON"})," vira CROSS JOIN — explosão combinatória."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SELECT *"})," em JOIN com colunas de mesmo nome confunde driver — sempre aliase explicitamente."]}),e.jsxs("li",{children:["GROUP BY sem ONLY_FULL_GROUP_BY ativo permite resultado indeterminado em colunas não agregadas — ative no ",e.jsx("code",{children:"sql_mode"}),"."]})]})]})}export{n as default};
