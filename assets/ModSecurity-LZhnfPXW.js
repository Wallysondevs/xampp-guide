import{j as e}from"./index-BreI0dyu.js";import{P as i,A as s}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function l(){return e.jsxs(i,{title:"ModSecurity — WAF embutido no Apache",subtitle:"Detectar e bloquear SQL injection, XSS, scanners e abuso direto no servidor — antes da requisição chegar no PHP. Setup com OWASP CRS, modo detection-only e tuning.",difficulty:"avancado",timeToRead:"13 min",children:[e.jsxs(s,{type:"info",title:"O que é WAF?",children:[e.jsx("strong",{children:"Web Application Firewall"}),": examina cada request HTTP procurando padrões de ataque conhecidos (SQLi, XSS, path traversal, RFI, scanners). Diferente do firewall de rede — ele entende a camada 7."]}),e.jsx("h2",{children:"O XAMPP traz?"}),e.jsxs("p",{children:["Não por padrão. Você precisa baixar o módulo ",e.jsx("code",{children:"mod_security2"})," compilado para a versão do Apache do XAMPP, e baixar separadamente as regras OWASP CRS. Em Linux é uma instalação ",e.jsx("code",{children:"apt"})," direta."]}),e.jsx(a,{title:"Linux",language:"bash",code:`sudo apt install libapache2-mod-security2
sudo a2enmod security2
sudo systemctl reload apache2`}),e.jsx(a,{title:"XAMPP Windows",language:"text",code:`1. Baixe mod_security para Apache 2.4 / VC15 (ou versão compatível)
   da Apache Lounge ou ICS Bond (.so)
2. Copie mod_security2.so para C:\\xampp\\apache\\modules\\
3. No httpd.conf:
       LoadModule security2_module modules/mod_security2.so
       LoadFile  C:/xampp/apache/bin/libcurl.dll   ; (se necessário)
       Include   conf/extra/modsecurity.conf`}),e.jsx("h2",{children:"Configuração base"}),e.jsx(a,{title:"conf/extra/modsecurity.conf — mínimo",language:"apache",code:`<IfModule security2_module>
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
</IfModule>`}),e.jsx("h2",{children:"OWASP Core Rule Set"}),e.jsxs("p",{children:["O ModSecurity sozinho é só motor — quem detecta ataques é o conjunto de regras. O padrão é o ",e.jsx("strong",{children:"OWASP CRS"}),":"]}),e.jsx(a,{language:"bash",code:`# Baixe a release estável
git clone https://github.com/coreruleset/coreruleset.git \\
    C:/xampp/apache/conf/modsecurity-crs

# Renomeie o setup
cd C:/xampp/apache/conf/modsecurity-crs
copy crs-setup.conf.example  crs-setup.conf`}),e.jsx("h2",{children:"Modo detecção-só (sempre comece por aqui)"}),e.jsx(a,{title:"modsecurity.conf — primeiros dias",language:"apache",code:"SecRuleEngine DetectionOnly"}),e.jsxs("p",{children:["Nada é bloqueado, mas tudo que ",e.jsx("em",{children:"seria"})," bloqueado vai pro audit log. Você ajusta falsos positivos primeiro — só depois passa para ",e.jsx("code",{children:"On"}),"."]}),e.jsx("h2",{children:"Níveis de paranoia (CRS)"}),e.jsx(a,{title:"crs-setup.conf",language:"apache",code:`# 1 = padrão (poucos falsos positivos)
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
     setvar:tx.outbound_anomaly_score_threshold=4"`}),e.jsx("h2",{children:"Lendo o audit log"}),e.jsx(a,{language:"text",code:`--abc123-A--                                ← timestamp + ID
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

--abc123-Z--                                ← fim do registro`}),e.jsx("h2",{children:"Falsos positivos — exclusões"}),e.jsxs("p",{children:["Caso uma regra dispare contra um request legítimo, exclua-a. Edite"," ",e.jsx("code",{children:"REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf"}),":"]}),e.jsx(a,{language:"apache",code:`# Excluir regra inteira para uma URL
SecRule REQUEST_URI "@beginsWith /api/markdown" \\
    "id:1001, phase:1, pass, nolog, ctl:ruleRemoveById=942100"

# Excluir uma regra para um parâmetro específico
SecRuleUpdateTargetById 942100 "!ARGS:conteudo"

# Excluir tag inteira
SecRule REQUEST_URI "@beginsWith /admin/relatorio" \\
    "id:1002, phase:1, pass, nolog, ctl:ruleRemoveByTag=attack-sqli"

# Excluir por IP (admin interno)
SecRule REMOTE_ADDR "@ipMatch 192.168.1.10" \\
    "id:1003, phase:1, pass, nolog, ctl:ruleEngine=Off"`}),e.jsx("h2",{children:"Regras customizadas"}),e.jsx(a,{language:"apache",code:`# Bloquear acesso a /wp-login.php se não vier do escritório
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
    "id:2005, phase:1, deny, status:403, msg:'Bad bot blocked'"`}),e.jsx(o,{title:"Diretivas SecRule mais usadas",params:[{flag:"phase:1..5",desc:"1=req headers, 2=req body, 3=resp headers, 4=resp body, 5=logging."},{flag:"deny | pass | block",desc:"Ação ao casar."},{flag:"status:403",desc:"Código HTTP devolvido em deny."},{flag:"log | nolog",desc:"Loga ou não."},{flag:"id:N",desc:"Identificador único (obrigatório)."},{flag:"msg:'texto'",desc:"Mensagem no audit log."},{flag:"tag:'attack-sqli'",desc:"Categoria — útil para excluir em massa."},{flag:"chain",desc:"Próxima regra é continuação (AND lógico)."},{flag:"t:lowercase,t:none",desc:"Transformações antes de comparar."}]}),e.jsx("h2",{children:"Operadores comuns"}),e.jsx(o,{title:"Após o '@'",params:[{flag:"@rx regex",desc:"Regex Perl-like."},{flag:"@streq texto",desc:"Igualdade exata."},{flag:"@beginsWith X",desc:"Prefixo."},{flag:"@contains X",desc:"Substring."},{flag:"@ipMatch 1.2.3.4/24",desc:"Match de IP/CIDR."},{flag:"@pmFromFile arquivo",desc:"Lista de strings (uma por linha)."},{flag:"@gt N / @lt N",desc:"Numérico."}]}),e.jsx("h2",{children:"Performance"}),e.jsx("p",{children:"ModSecurity custa CPU. Em máquina pesada, considere:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Aumentar ",e.jsx("code",{children:"SecRequestBodyLimit"})," só se houver upload grande de verdade — inspecionar 100 MB em cada request mata."]}),e.jsxs("li",{children:["Excluir paths estáticos: ",e.jsx("code",{children:'SecRule REQUEST_URI "\\\\.(jpg|png|css|js)$" "phase:1, pass, nolog, ctl:ruleEngine=Off"'})]}),e.jsxs("li",{children:["Ajustar ",e.jsx("code",{children:"tx.paranoia_level"})," — nível 3 é caro em regex."]}),e.jsxs("li",{children:["Manter audit log ",e.jsx("strong",{children:"RelevantOnly"})," (não em ",e.jsx("code",{children:"On"})," total)."]})]}),e.jsx("h2",{children:"Receita: rollout em produção"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Instale ModSecurity + CRS em servidor de homologação."}),e.jsxs("li",{children:[e.jsx("code",{children:"SecRuleEngine DetectionOnly"})," por 1 semana."]}),e.jsx("li",{children:"Analise o audit log — toda regra que disparar contra request legítimo, exclua."}),e.jsx("li",{children:"Replique no servidor de produção em modo DetectionOnly por 3 dias."}),e.jsxs("li",{children:["Vire para ",e.jsx("code",{children:"On"})," com paranoia 1."]}),e.jsx("li",{children:"Suba paranoia gradualmente, se tiver fôlego pra ajustar."}),e.jsx("li",{children:"Crie alerta para quando uma regra começar a disparar muito (mudança no app)."})]}),e.jsx("h2",{children:"Logs e monitoramento"}),e.jsx(a,{language:"bash",code:`# Top regras disparadas
awk '/Message:.*\\[id "([0-9]+)"\\]/ {match($0, /id "([0-9]+)"/, a); print a[1]}' \\
    logs/modsec_audit.log | sort | uniq -c | sort -rn | head

# Top IPs bloqueados
awk '/Action: Intercepted/{getline; print $NF}' logs/modsec_audit.log | \\
    sort | uniq -c | sort -rn | head -20`}),e.jsx("h2",{children:"Ferramentas auxiliares"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"WAF-FLE / Auditconsole"})," — coletor central de audit logs em interface web."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Crowdsec"})," — alternativa moderna, leve, comunidade compartilha listas de IPs maliciosos em real-time."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cloudflare WAF"})," — se já está atrás do Cloudflare, pode ser suficiente."]})]}),e.jsx(s,{type:"warning",title:"WAF não substitui código seguro",children:"Prepared statements, validação de input, output encoding, autenticação correta — tudo continua obrigatório. ModSecurity é uma camada extra; se virar a única, qualquer regex criativa quebra."}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Subir CRS em modo ",e.jsx("code",{children:"On"})," direto → falsos positivos quebram funcionalidades."]}),e.jsxs("li",{children:["Audit log de tudo (",e.jsx("code",{children:"SecAuditEngine On"}),") → arquivo cresce GBs/dia."]}),e.jsxs("li",{children:["Esquecer ",e.jsx("code",{children:"id:"})," único nas regras custom → Apache não inicia."]}),e.jsx("li",{children:"Blacklist de IPs sem expiração → lista cresce eternamente."})]})]})}export{l as default};
