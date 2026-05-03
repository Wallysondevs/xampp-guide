import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MariaDBProcedures() {
  return (
    <PageContainer
      title="Stored Procedures, Triggers e Events"
      subtitle="Lógica viva no banco — quando faz sentido, como criar, depurar e quando NÃO usar."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <AlertBox type="info" title="Quando usar?">
        Quando a lógica é puramente sobre dados e precisa rodar próximo deles (atualizações em
        massa, integridade, auditoria). Quando há clientes diferentes (PHP, Node, Python) que
        precisam executar a mesma rotina sem duplicar código.
      </AlertBox>
      <AlertBox type="warning" title="Quando NÃO usar">
        Lógica de negócio do app (preços, regras de desconto, cálculos complexos). Versão fica
        fora do Git, debug é horrível, e migrar de banco depois é dor.
      </AlertBox>

      <h2>Sintaxe básica — DELIMITER</h2>
      <p>
        Procedures usam <code>;</code> internamente. Para o cliente não interpretar como fim, troca-se
        o delimitador.
      </p>
      <CodeBlock
        language="sql"
        code={`DELIMITER //

CREATE PROCEDURE saudacao(IN nome VARCHAR(50))
BEGIN
    SELECT CONCAT('Olá, ', nome, '!') AS msg;
END //

DELIMITER ;

-- Chamando
CALL saudacao('Maria');`}
      />

      <h2>Parâmetros: IN, OUT, INOUT</h2>
      <CodeBlock
        language="sql"
        code={`DELIMITER //

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
SELECT @t;`}
      />

      <ParamsTable
        title="Modos de parâmetro"
        params={[
          { flag: "IN", desc: "Entrada (padrão). A procedure não modifica." },
          { flag: "OUT", desc: "Saída. Procedure escreve, chamador lê depois via @variavel." },
          { flag: "INOUT", desc: "Os dois — útil para acumuladores." },
        ]}
      />

      <h2>Variáveis locais e controle de fluxo</h2>
      <CodeBlock
        language="sql"
        code={`DELIMITER //

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

DELIMITER ;`}
      />

      <h2>Loops</h2>
      <CodeBlock
        language="sql"
        code={`DELIMITER //

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

DELIMITER ;`}
      />

      <h2>Cursors — iterar resultados</h2>
      <CodeBlock
        language="sql"
        code={`DELIMITER //

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

DELIMITER ;`}
      />

      <h2>Tratamento de erros</h2>
      <CodeBlock
        language="sql"
        code={`DELIMITER //

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

DELIMITER ;`}
      />

      <h2>Functions — retornam valor</h2>
      <CodeBlock
        language="sql"
        code={`DELIMITER //

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
SELECT id, nome, calcular_desconto(preco, 'platinum') AS preco_final FROM produtos;`}
      />
      <ParamsTable
        title="Atributos de function importantes"
        params={[
          { flag: "DETERMINISTIC", desc: "Mesma entrada → mesma saída sempre. Permite otimizações." },
          { flag: "NOT DETERMINISTIC", desc: "Pode variar (ex: usa NOW()). Padrão." },
          { flag: "READS SQL DATA", desc: "Lê tabelas mas não modifica." },
          { flag: "MODIFIES SQL DATA", desc: "Insere/atualiza." },
          { flag: "NO SQL", desc: "Só matemática. Mais rápido." },
        ]}
      />

      <h2>Triggers</h2>
      <p>Disparam automaticamente em INSERT/UPDATE/DELETE.</p>
      <CodeBlock
        language="sql"
        code={`DELIMITER //

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

DELIMITER ;`}
      />
      <ParamsTable
        title="Tipos de trigger"
        params={[
          { flag: "BEFORE INSERT", desc: "Antes de inserir — pode alterar NEW." },
          { flag: "AFTER INSERT", desc: "Depois de inserir." },
          { flag: "BEFORE UPDATE", desc: "Antes de atualizar — vê OLD e NEW." },
          { flag: "AFTER UPDATE", desc: "Depois — útil pra auditoria." },
          { flag: "BEFORE DELETE", desc: "Antes — pode bloquear via SIGNAL." },
          { flag: "AFTER DELETE", desc: "Depois — pode arquivar." },
        ]}
      />

      <h2>Events — agendador interno</h2>
      <CodeBlock
        title="Habilitar primeiro"
        language="sql"
        code={`SET GLOBAL event_scheduler = ON;

-- Permanente: my.ini
-- [mysqld]
-- event_scheduler = ON`}
      />
      <CodeBlock
        language="sql"
        code={`DELIMITER //

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
SELECT * FROM information_schema.EVENTS;`}
      />

      <h2>Inspecionando o que existe</h2>
      <CodeBlock
        language="sql"
        code={`SHOW PROCEDURE STATUS WHERE Db = 'loja';
SHOW FUNCTION STATUS  WHERE Db = 'loja';
SHOW TRIGGERS         IN  loja;
SHOW EVENTS           FROM loja;

-- Ver o código de uma procedure
SHOW CREATE PROCEDURE loja.transferir;`}
      />

      <h2>Versionando no Git</h2>
      <CodeBlock
        title="db/procedures/transferir.sql"
        language="sql"
        code={`DROP PROCEDURE IF EXISTS transferir;
DELIMITER //
CREATE PROCEDURE transferir(...)
BEGIN
    -- ...
END //
DELIMITER ;`}
      />
      <p>
        Aplique via script de migração (Phinx, Doctrine Migrations, Flyway) — assim a procedure
        nasce no Git, não direto no banco.
      </p>

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Triggers se acumulam silenciosamente — uma queima na cascata e ninguém entende a
          lentidão.
        </li>
        <li>
          Procedures invisíveis no Git → conhecimento se perde quando o autor sai.
        </li>
        <li>
          <code>SIGNAL SQLSTATE '45000'</code> sem mensagem clara → debugging horrível no PHP.
        </li>
        <li>
          Events ativos em ambiente de teste rodando em base de produção (esqueceram de mudar
          DSN) → estrago.
        </li>
        <li>
          Esquecer <code>DELIMITER ;</code> no fim do arquivo → próximo comando dá erro confuso.
        </li>
      </ul>
    </PageContainer>
  );
}
