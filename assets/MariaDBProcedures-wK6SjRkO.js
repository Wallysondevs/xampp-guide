import{j as e}from"./index-BreI0dyu.js";import{P as r,A as o}from"./AlertBox-C_bJKc46.js";import{C as E}from"./CodeBlock-D0rWxPIU.js";import{P as a}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function T(){return e.jsxs(r,{title:"Stored Procedures, Triggers e Events",subtitle:"Lógica viva no banco — quando faz sentido, como criar, depurar e quando NÃO usar.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsx(o,{type:"info",title:"Quando usar?",children:"Quando a lógica é puramente sobre dados e precisa rodar próximo deles (atualizações em massa, integridade, auditoria). Quando há clientes diferentes (PHP, Node, Python) que precisam executar a mesma rotina sem duplicar código."}),e.jsx(o,{type:"warning",title:"Quando NÃO usar",children:"Lógica de negócio do app (preços, regras de desconto, cálculos complexos). Versão fica fora do Git, debug é horrível, e migrar de banco depois é dor."}),e.jsx("h2",{children:"Sintaxe básica — DELIMITER"}),e.jsxs("p",{children:["Procedures usam ",e.jsx("code",{children:";"})," internamente. Para o cliente não interpretar como fim, troca-se o delimitador."]}),e.jsx(E,{language:"sql",code:`DELIMITER //

CREATE PROCEDURE saudacao(IN nome VARCHAR(50))
BEGIN
    SELECT CONCAT('Olá, ', nome, '!') AS msg;
END //

DELIMITER ;

-- Chamando
CALL saudacao('Maria');`}),e.jsx("h2",{children:"Parâmetros: IN, OUT, INOUT"}),e.jsx(E,{language:"sql",code:`DELIMITER //

CREATE PROCEDURE total_pedidos(
    IN  p_user_id INT,
    OUT p_total   DECIMAL(10,2)
)
BEGIN
    SELECT COALESCE(SUM(valor), 0) INTO p_total
      FROM pedidos
     WHERE user_id = p_user_id;
END //

DELIMITER ;

CALL total_pedidos(42, @t);
SELECT @t;`}),e.jsx(a,{title:"Modos de parâmetro",params:[{flag:"IN",desc:"Entrada (padrão). A procedure não modifica."},{flag:"OUT",desc:"Saída. Procedure escreve, chamador lê depois via @variavel."},{flag:"INOUT",desc:"Os dois — útil para acumuladores."}]}),e.jsx("h2",{children:"Variáveis locais e controle de fluxo"}),e.jsx(E,{language:"sql",code:`DELIMITER //

CREATE PROCEDURE classificar_cliente(IN p_user_id INT)
BEGIN
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_tier  VARCHAR(20);

    SELECT COALESCE(SUM(valor), 0) INTO v_total
      FROM pedidos WHERE user_id = p_user_id;

    IF v_total >= 10000 THEN
        SET v_tier = 'platinum';
    ELSEIF v_total >= 1000 THEN
        SET v_tier = 'gold';
    ELSE
        SET v_tier = 'standard';
    END IF;

    UPDATE usuarios SET tier = v_tier WHERE id = p_user_id;
END //

DELIMITER ;`}),e.jsx("h2",{children:"Loops"}),e.jsx(E,{language:"sql",code:`DELIMITER //

CREATE PROCEDURE somar_ate(IN n INT, OUT total INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    SET total = 0;

    WHILE i <= n DO
        SET total = total + i;
        SET i = i + 1;
    END WHILE;
END //

-- Equivalente com REPEAT
CREATE PROCEDURE somar_repeat(IN n INT, OUT total INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    SET total = 0;

    rep_loop: REPEAT
        SET total = total + i;
        SET i = i + 1;
    UNTIL i > n END REPEAT rep_loop;
END //

DELIMITER ;`}),e.jsx("h2",{children:"Cursors — iterar resultados"}),e.jsx(E,{language:"sql",code:`DELIMITER //

CREATE PROCEDURE recalcular_estoque()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_id INT;
    DECLARE v_qtd INT;
    DECLARE cur CURSOR FOR
        SELECT id, quantidade FROM produtos WHERE ativo = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;
    leitura: LOOP
        FETCH cur INTO v_id, v_qtd;
        IF done THEN LEAVE leitura; END IF;

        UPDATE produtos
           SET disponivel = (v_qtd > 0)
         WHERE id = v_id;
    END LOOP;
    CLOSE cur;
END //

DELIMITER ;`}),e.jsx("h2",{children:"Tratamento de erros"}),e.jsx(E,{language:"sql",code:`DELIMITER //

CREATE PROCEDURE transferir(
    IN p_origem INT,
    IN p_destino INT,
    IN p_valor DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE contas SET saldo = saldo - p_valor WHERE id = p_origem;
        UPDATE contas SET saldo = saldo + p_valor WHERE id = p_destino;

        IF (SELECT saldo FROM contas WHERE id = p_origem) < 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Saldo insuficiente';
        END IF;
    COMMIT;
END //

DELIMITER ;`}),e.jsx("h2",{children:"Functions — retornam valor"}),e.jsx(E,{language:"sql",code:`DELIMITER //

CREATE FUNCTION calcular_desconto(p_valor DECIMAL(10,2), p_tier VARCHAR(20))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE pct DECIMAL(5,2);
    SET pct = CASE p_tier
                WHEN 'platinum' THEN 0.20
                WHEN 'gold'     THEN 0.10
                ELSE 0.00
              END;
    RETURN p_valor - (p_valor * pct);
END //

DELIMITER ;

-- Use no SQL como qualquer função
SELECT calcular_desconto(100, 'gold');
SELECT id, nome, calcular_desconto(preco, 'platinum') AS preco_final FROM produtos;`}),e.jsx(a,{title:"Atributos de function importantes",params:[{flag:"DETERMINISTIC",desc:"Mesma entrada → mesma saída sempre. Permite otimizações."},{flag:"NOT DETERMINISTIC",desc:"Pode variar (ex: usa NOW()). Padrão."},{flag:"READS SQL DATA",desc:"Lê tabelas mas não modifica."},{flag:"MODIFIES SQL DATA",desc:"Insere/atualiza."},{flag:"NO SQL",desc:"Só matemática. Mais rápido."}]}),e.jsx("h2",{children:"Triggers"}),e.jsx("p",{children:"Disparam automaticamente em INSERT/UPDATE/DELETE."}),e.jsx(E,{language:"sql",code:`DELIMITER //

-- Auditoria automática
CREATE TRIGGER trg_produtos_log_update
AFTER UPDATE ON produtos
FOR EACH ROW
BEGIN
    INSERT INTO produtos_historico
        (produto_id, antigo_preco, novo_preco, alterado_em, alterado_por)
        VALUES (OLD.id, OLD.preco, NEW.preco, NOW(), CURRENT_USER());
END //

-- Validação que o app esqueceu
CREATE TRIGGER trg_produtos_check_preco
BEFORE INSERT ON produtos
FOR EACH ROW
BEGIN
    IF NEW.preco < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Preço não pode ser negativo';
    END IF;
END //

DELIMITER ;`}),e.jsx(a,{title:"Tipos de trigger",params:[{flag:"BEFORE INSERT",desc:"Antes de inserir — pode alterar NEW."},{flag:"AFTER INSERT",desc:"Depois de inserir."},{flag:"BEFORE UPDATE",desc:"Antes de atualizar — vê OLD e NEW."},{flag:"AFTER UPDATE",desc:"Depois — útil pra auditoria."},{flag:"BEFORE DELETE",desc:"Antes — pode bloquear via SIGNAL."},{flag:"AFTER DELETE",desc:"Depois — pode arquivar."}]}),e.jsx("h2",{children:"Events — agendador interno"}),e.jsx(E,{title:"Habilitar primeiro",language:"sql",code:`SET GLOBAL event_scheduler = ON;

-- Permanente: my.ini
-- [mysqld]
-- event_scheduler = ON`}),e.jsx(E,{language:"sql",code:`DELIMITER //

-- Limpar logs antigos toda madrugada
CREATE EVENT ev_limpar_logs
ON SCHEDULE EVERY 1 DAY
STARTS '2026-05-04 03:00:00'
DO
BEGIN
    DELETE FROM logs WHERE criado_em < DATE_SUB(NOW(), INTERVAL 90 DAY);
END //

-- Calcular resumo a cada hora
CREATE EVENT ev_resumo_horario
ON SCHEDULE EVERY 1 HOUR
DO
    INSERT INTO resumo_vendas (hora, total)
    SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:00'), SUM(valor)
      FROM pedidos
     WHERE pago_em >= NOW() - INTERVAL 1 HOUR //

DELIMITER ;

-- Listar
SHOW EVENTS;
SELECT * FROM information_schema.EVENTS;`}),e.jsx("h2",{children:"Inspecionando o que existe"}),e.jsx(E,{language:"sql",code:`SHOW PROCEDURE STATUS WHERE Db = 'loja';
SHOW FUNCTION STATUS  WHERE Db = 'loja';
SHOW TRIGGERS         IN  loja;
SHOW EVENTS           FROM loja;

-- Ver o código de uma procedure
SHOW CREATE PROCEDURE loja.transferir;`}),e.jsx("h2",{children:"Versionando no Git"}),e.jsx(E,{title:"db/procedures/transferir.sql",language:"sql",code:`DROP PROCEDURE IF EXISTS transferir;
DELIMITER //
CREATE PROCEDURE transferir(...)
BEGIN
    -- ...
END //
DELIMITER ;`}),e.jsx("p",{children:"Aplique via script de migração (Phinx, Doctrine Migrations, Flyway) — assim a procedure nasce no Git, não direto no banco."}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Triggers se acumulam silenciosamente — uma queima na cascata e ninguém entende a lentidão."}),e.jsx("li",{children:"Procedures invisíveis no Git → conhecimento se perde quando o autor sai."}),e.jsxs("li",{children:[e.jsx("code",{children:"SIGNAL SQLSTATE '45000'"})," sem mensagem clara → debugging horrível no PHP."]}),e.jsx("li",{children:"Events ativos em ambiente de teste rodando em base de produção (esqueceram de mudar DSN) → estrago."}),e.jsxs("li",{children:["Esquecer ",e.jsx("code",{children:"DELIMITER ;"})," no fim do arquivo → próximo comando dá erro confuso."]})]})]})}export{T as default};
