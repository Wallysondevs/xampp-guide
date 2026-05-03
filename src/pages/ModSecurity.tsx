import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ModSecurity() {
  return (
    <PageContainer
      title="ModSecurity — WAF embutido no Apache"
      subtitle="Detectar e bloquear SQL injection, XSS, scanners e abuso direto no servidor — antes da requisição chegar no PHP. Setup com OWASP CRS, modo detection-only e tuning."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <AlertBox type="info" title="O que é WAF?">
        <strong>Web Application Firewall</strong>: examina cada request HTTP procurando padrões
        de ataque conhecidos (SQLi, XSS, path traversal, RFI, scanners). Diferente do firewall
        de rede — ele entende a camada 7.
      </AlertBox>

      <h2>O XAMPP traz?</h2>
      <p>
        Não por padrão. Você precisa baixar o módulo <code>mod_security2</code> compilado para a
        versão do Apache do XAMPP, e baixar separadamente as regras OWASP CRS. Em Linux é uma
        instalação <code>apt</code> direta.
      </p>

      <CodeBlock
        title="Linux"
        language="bash"
        code={`sudo apt install libapache2-mod-security2
sudo a2enmod security2
sudo systemctl reload apache2`}
      />
      <CodeBlock
        title="XAMPP Windows"
        language="text"
        code={`1. Baixe mod_security para Apache 2.4 / VC15 (ou versão compatível)
   da Apache Lounge ou ICS Bond (.so)
2. Copie mod_security2.so para C:\\xampp\\apache\\modules\\
3. No httpd.conf:
       LoadModule security2_module modules/mod_security2.so
       LoadFile  C:/xampp/apache/bin/libcurl.dll   ; (se necessário)
       Include   conf/extra/modsecurity.conf`}
      />

      <h2>Configuração base</h2>
      <CodeBlock
        title="conf/extra/modsecurity.conf — mínimo"
        language="apache"
        code={`<IfModule security2_module>
    SecRuleEngine             On            ; On | Off | DetectionOnly
    SecRequestBodyAccess      On
    SecResponseBodyAccess     Off
    SecRequestBodyLimit       13107200       ; 12.5 MB
    SecRequestBodyNoFilesLimit 131072        ; 128 KB

    SecAuditEngine            RelevantOnly
    SecAuditLog               "logs/modsec_audit.log"
    SecAuditLogParts          "ABIJDEFHZ"
    SecAuditLogType           Serial

    SecDebugLog               "logs/modsec_debug.log"
    SecDebugLogLevel          0              ; 0 silencioso, 9 verboso

    SecTmpDir                 C:/xampp/tmp
    SecDataDir                C:/xampp/tmp

    Include conf/modsecurity-crs/crs-setup.conf
    Include conf/modsecurity-crs/rules/*.conf
</IfModule>`}
      />

      <h2>OWASP Core Rule Set</h2>
      <p>
        O ModSecurity sozinho é só motor — quem detecta ataques é o conjunto de regras. O padrão
        é o <strong>OWASP CRS</strong>:
      </p>
      <CodeBlock
        language="bash"
        code={`# Baixe a release estável
git clone https://github.com/coreruleset/coreruleset.git \\
    C:/xampp/apache/conf/modsecurity-crs

# Renomeie o setup
cd C:/xampp/apache/conf/modsecurity-crs
copy crs-setup.conf.example  crs-setup.conf`}
      />

      <h2>Modo detecção-só (sempre comece por aqui)</h2>
      <CodeBlock
        title="modsecurity.conf — primeiros dias"
        language="apache"
        code={`SecRuleEngine DetectionOnly`}
      />
      <p>
        Nada é bloqueado, mas tudo que <em>seria</em> bloqueado vai pro audit log. Você ajusta
        falsos positivos primeiro — só depois passa para <code>On</code>.
      </p>

      <h2>Níveis de paranoia (CRS)</h2>
      <CodeBlock
        title="crs-setup.conf"
        language="apache"
        code={`# 1 = padrão (poucos falsos positivos)
# 2 = razoável (algumas regras agressivas, ainda bom)
# 3 = paranóico (muito falso positivo)
# 4 = crazy (educacional)
SecAction \\
    "id:900000, phase:1, nolog, pass, t:none, \\
     setvar:tx.paranoia_level=2"

# Anomalia: cada regra soma pontos. Bloqueia se passar do limite.
SecAction \\
    "id:900110, phase:1, nolog, pass, t:none, \\
     setvar:tx.inbound_anomaly_score_threshold=5, \\
     setvar:tx.outbound_anomaly_score_threshold=4"`}
      />

      <h2>Lendo o audit log</h2>
      <CodeBlock
        language="text"
        code={`--abc123-A--                                ← timestamp + ID
[03/May/2026:14:23:11 -0300] ... 192.0.2.10 ...

--abc123-B--                                ← request headers
GET /produto?id=1 UNION SELECT password FROM users HTTP/1.1
Host: meusite.local

--abc123-H--                                ← decisões do ModSecurity
Message: Warning. Pattern match "(?i:union\\s+select)" at ARGS:id.
   [file "owasp-crs/rules/REQUEST-942-APPLICATION-ATTACK-SQLI.conf"]
   [line "65"] [id "942100"] [msg "SQL Injection Attack Detected"]
   [tag "OWASP_CRS"] [tag "attack-sqli"]
Action: Intercepted (phase 2)
Stopwatch: ... 941ms ...

--abc123-Z--                                ← fim do registro`}
      />

      <h2>Falsos positivos — exclusões</h2>
      <p>
        Caso uma regra dispare contra um request legítimo, exclua-a. Edite{" "}
        <code>REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf</code>:
      </p>
      <CodeBlock
        language="apache"
        code={`# Excluir regra inteira para uma URL
SecRule REQUEST_URI "@beginsWith /api/markdown" \\
    "id:1001, phase:1, pass, nolog, ctl:ruleRemoveById=942100"

# Excluir uma regra para um parâmetro específico
SecRuleUpdateTargetById 942100 "!ARGS:conteudo"

# Excluir tag inteira
SecRule REQUEST_URI "@beginsWith /admin/relatorio" \\
    "id:1002, phase:1, pass, nolog, ctl:ruleRemoveByTag=attack-sqli"

# Excluir por IP (admin interno)
SecRule REMOTE_ADDR "@ipMatch 192.168.1.10" \\
    "id:1003, phase:1, pass, nolog, ctl:ruleEngine=Off"`}
      />

      <h2>Regras customizadas</h2>
      <CodeBlock
        language="apache"
        code={`# Bloquear acesso a /wp-login.php se não vier do escritório
SecRule REQUEST_URI "@streq /wp-login.php" \\
    "id:2001, phase:1, deny, status:403, log, msg:'wp-login externo', \\
     chain"
    SecRule REMOTE_ADDR "!@ipMatch 192.168.1.0/24"

# Limitar requests de um IP — 100 em 60 seg
SecAction "id:2002, phase:1, pass, nolog, initcol:ip=%{REMOTE_ADDR}"
SecRule IP:REQ_COUNT "@gt 100" \\
    "id:2003, phase:1, deny, status:429, msg:'Rate limit'"
SecAction "id:2004, phase:5, pass, nolog, expirevar:ip.req_count=60, \\
           setvar:ip.req_count=+1"

# Bloquear User-Agents conhecidos como ferramenta de ataque
SecRule REQUEST_HEADERS:User-Agent "@pmFromFile /etc/modsecurity/badbots.txt" \\
    "id:2005, phase:1, deny, status:403, msg:'Bad bot blocked'"`}
      />

      <ParamsTable
        title="Diretivas SecRule mais usadas"
        params={[
          { flag: "phase:1..5", desc: "1=req headers, 2=req body, 3=resp headers, 4=resp body, 5=logging." },
          { flag: "deny | pass | block", desc: "Ação ao casar." },
          { flag: "status:403", desc: "Código HTTP devolvido em deny." },
          { flag: "log | nolog", desc: "Loga ou não." },
          { flag: "id:N", desc: "Identificador único (obrigatório)." },
          { flag: "msg:'texto'", desc: "Mensagem no audit log." },
          { flag: "tag:'attack-sqli'", desc: "Categoria — útil para excluir em massa." },
          { flag: "chain", desc: "Próxima regra é continuação (AND lógico)." },
          { flag: "t:lowercase,t:none", desc: "Transformações antes de comparar." },
        ]}
      />

      <h2>Operadores comuns</h2>
      <ParamsTable
        title="Após o '@'"
        params={[
          { flag: "@rx regex", desc: "Regex Perl-like." },
          { flag: "@streq texto", desc: "Igualdade exata." },
          { flag: "@beginsWith X", desc: "Prefixo." },
          { flag: "@contains X", desc: "Substring." },
          { flag: "@ipMatch 1.2.3.4/24", desc: "Match de IP/CIDR." },
          { flag: "@pmFromFile arquivo", desc: "Lista de strings (uma por linha)." },
          { flag: "@gt N / @lt N", desc: "Numérico." },
        ]}
      />

      <h2>Performance</h2>
      <p>
        ModSecurity custa CPU. Em máquina pesada, considere:
      </p>
      <ul>
        <li>
          Aumentar <code>SecRequestBodyLimit</code> só se houver upload grande de verdade —
          inspecionar 100 MB em cada request mata.
        </li>
        <li>
          Excluir paths estáticos: <code>SecRule REQUEST_URI "\\.(jpg|png|css|js)$" "phase:1, pass, nolog, ctl:ruleEngine=Off"</code>
        </li>
        <li>
          Ajustar <code>tx.paranoia_level</code> — nível 3 é caro em regex.
        </li>
        <li>
          Manter audit log <strong>RelevantOnly</strong> (não em <code>On</code> total).
        </li>
      </ul>

      <h2>Receita: rollout em produção</h2>
      <ol>
        <li>Instale ModSecurity + CRS em servidor de homologação.</li>
        <li><code>SecRuleEngine DetectionOnly</code> por 1 semana.</li>
        <li>Analise o audit log — toda regra que disparar contra request legítimo, exclua.</li>
        <li>Replique no servidor de produção em modo DetectionOnly por 3 dias.</li>
        <li>Vire para <code>On</code> com paranoia 1.</li>
        <li>Suba paranoia gradualmente, se tiver fôlego pra ajustar.</li>
        <li>Crie alerta para quando uma regra começar a disparar muito (mudança no app).</li>
      </ol>

      <h2>Logs e monitoramento</h2>
      <CodeBlock
        language="bash"
        code={`# Top regras disparadas
awk '/Message:.*\\[id "([0-9]+)"\\]/ {match($0, /id "([0-9]+)"/, a); print a[1]}' \\
    logs/modsec_audit.log | sort | uniq -c | sort -rn | head

# Top IPs bloqueados
awk '/Action: Intercepted/{getline; print $NF}' logs/modsec_audit.log | \\
    sort | uniq -c | sort -rn | head -20`}
      />

      <h2>Ferramentas auxiliares</h2>
      <ul>
        <li>
          <strong>WAF-FLE / Auditconsole</strong> — coletor central de audit logs em interface web.
        </li>
        <li>
          <strong>Crowdsec</strong> — alternativa moderna, leve, comunidade compartilha listas
          de IPs maliciosos em real-time.
        </li>
        <li>
          <strong>Cloudflare WAF</strong> — se já está atrás do Cloudflare, pode ser suficiente.
        </li>
      </ul>

      <AlertBox type="warning" title="WAF não substitui código seguro">
        Prepared statements, validação de input, output encoding, autenticação correta — tudo
        continua obrigatório. ModSecurity é uma camada extra; se virar a única, qualquer regex
        criativa quebra.
      </AlertBox>

      <h2>Armadilhas</h2>
      <ul>
        <li>Subir CRS em modo <code>On</code> direto → falsos positivos quebram funcionalidades.</li>
        <li>Audit log de tudo (<code>SecAuditEngine On</code>) → arquivo cresce GBs/dia.</li>
        <li>Esquecer <code>id:</code> único nas regras custom → Apache não inicia.</li>
        <li>Blacklist de IPs sem expiração → lista cresce eternamente.</li>
      </ul>
    </PageContainer>
  );
}
