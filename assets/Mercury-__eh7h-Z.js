import{j as e}from"./index-BreI0dyu.js";import{P as r,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as i}from"./ParamsTable-DyRs6_CQ.js";import{P as s}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function u(){return e.jsxs(r,{title:"Mercury Mail — testando email no XAMPP",subtitle:"Servidor SMTP local que vem dentro do XAMPP. Para testar mail() do PHP sem precisar do Gmail — e quando vale mais a pena trocar pelo MailHog/Mailtrap.",difficulty:"avancado",timeToRead:"10 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["Saber editar o ",e.jsx("a",{href:"#/php-ini",children:"php.ini"})," e reiniciar o Apache pelo ",e.jsx("a",{href:"#/painel-controle",children:"painel"}),". Conhecer o conceito de SMTP (envio) versus POP3/IMAP (recebimento) ajuda, mas não é essencial."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"SMTP"})," (Simple Mail Transfer Protocol) — protocolo de envio de e-mail. Por padrão usa porta 25 (sem TLS), 587 (STARTTLS) ou 465 (TLS implícito)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"POP3 / IMAP"})," — protocolos de leitura. POP3 baixa e apaga do servidor; IMAP mantém tudo no servidor sincronizado."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"MTA"})," (Mail Transfer Agent) — programa que recebe e-mails e os entrega ou repassa adiante. Mercury, Postfix, Sendmail e Exim são MTAs."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"MX record"}),' — registro DNS que diz "para este domínio, envie e-mails para este servidor". Em desenvolvimento local você não tem MX — por isso precisa de um SMTP fake.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"SPF / DKIM / DMARC"})," — registros DNS que provam que o seu e-mail é legítimo. Sem eles, mensagens de produção caem em spam."]}),e.jsxs("p",{children:["Quando você roda ",e.jsx("code",{children:"mail()"})," no PHP, o XAMPP precisa de um SMTP para entregar a mensagem. Em produção, é o servidor da hospedagem ou um serviço transacional (SendGrid, SES, Mailgun). Em desenvolvimento, as opções são: ",e.jsx("strong",{children:"Mercury"})," (vem no XAMPP), ",e.jsx("strong",{children:"MailHog"})," (mais moderno e bonitinho),"," ",e.jsx("strong",{children:"MailPit"})," (sucessor do MailHog) ou serviços online como ",e.jsx("strong",{children:"Mailtrap"}),"."]}),e.jsx(o,{type:"info",title:"Para a maioria, MailHog/Mailpit ou Mailtrap são melhores",children:'O Mercury é poderoso mas tem interface dos anos 90 e configuração chata. Se a única necessidade é "ver os e-mails que meu sistema enviaria", MailHog/Mailpit ou Mailtrap dão menos trabalho. Mantemos o Mercury aqui porque ele já vem instalado no XAMPP — pula a instalação extra.'}),e.jsx("h2",{children:"Como o e-mail sai do PHP até a caixa do destinatário"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["PHP chama ",e.jsx("code",{children:"mail()"})," — internamente ele usa o que estiver configurado em ",e.jsx("code",{children:"SMTP"})," e ",e.jsx("code",{children:"smtp_port"})," do"," ",e.jsx("code",{children:"php.ini"})," (em Windows). Em Linux/macOS, usa o binário definido em ",e.jsx("code",{children:"sendmail_path"}),"."]}),e.jsx("li",{children:"A mensagem sai para o MTA local (Mercury) na 25."}),e.jsx("li",{children:"O MTA olha o domínio do destinatário, consulta o MX record via DNS e tenta entregar via SMTP no servidor remoto."}),e.jsx("li",{children:"O servidor remoto pode aceitar (entrega na caixa), recusar (5xx) ou jogar em quarentena/spam dependendo de SPF/DKIM/DMARC."})]}),e.jsx(o,{type:"warning",title:"Por que SMTP local quase nunca chega em produção",children:"Provedores grandes (Gmail, Outlook, Yahoo) bloqueiam quase todo e-mail vindo de IP residencial — independente do quão bem configurado seu Mercury esteja. Para enviar de verdade na internet, use um serviço dedicado."}),e.jsx("h2",{children:"1. Habilitando o Mercury no XAMPP"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Confirme no instalador do XAMPP que ",e.jsx("strong",{children:'"Mercury Mail Server"'})," foi marcado. Se não foi, rode o instalador novamente e marque (não perde nada do que já está lá)."]}),e.jsxs("li",{children:["No painel, clique em ",e.jsx("strong",{children:"Start"})," ao lado de Mercury."]}),e.jsx("li",{children:"O ícone do Mercury aparece na bandeja do sistema. Clique duas vezes para abrir a janela principal."}),e.jsx("li",{children:"A primeira vez, o Mercury pode pedir confirmação do firewall do Windows — autorize."})]}),e.jsx("p",{children:"A janela do Mercury é dividida em vários protocolos numa MDI (várias janelas internas):"}),e.jsx(i,{title:"Módulos do Mercury",params:[{flag:"Mercury Core (MercuryC)",desc:"Cliente SMTP que envia e-mails para servidores externos. Quem fala com o Gmail."},{flag:"Mercury SMTP (MercuryS)",desc:"Servidor SMTP. Recebe os e-mails que o PHP envia. É este que precisa estar ativo para mail() funcionar."},{flag:"Mercury POP3 (MercuryP)",desc:"Servidor POP3 — clientes (Thunderbird etc) baixam e-mails dele."},{flag:"Mercury IMAP (MercuryI)",desc:"Servidor IMAP — alternativa moderna ao POP3, sincroniza pastas."},{flag:"Mercury HTTP (MercuryH)",desc:"Webmail simples para acessar caixas pelo navegador."},{flag:"Mercury Distribution (MercuryD)",desc:"Cliente POP3 — busca e-mails de caixas externas e baixa para o Mercury."}]}),e.jsxs("p",{children:['Para o cenário "PHP local manda, eu vejo numa caixa local", basta deixar ',e.jsx("strong",{children:"MercuryS"})," (SMTP) ativo. Os outros podem ser desligados em ",e.jsx("em",{children:"Configuration → Protocol modules"}),"."]}),e.jsx("h2",{children:"2. Apontando o PHP para o Mercury"}),e.jsxs("p",{children:["Abra o ",e.jsx("code",{children:"php.ini"})," e procure pela seção ",e.jsx("code",{children:"[mail function]"}),":"]}),e.jsx(a,{language:"ini",code:`[mail function]
; Para Windows
SMTP = localhost
smtp_port = 25
sendmail_from = noreply@meusite.local

; Para Linux/macOS, deixe SMTP/smtp_port comentados e use:
sendmail_path = "/usr/sbin/sendmail -t -i"
; Em Linux com Mercury raramente é o caso (Mercury é prático em Windows).
; Em distros, o usual é instalar Postfix ou ssmtp e apontar para um SMTP de verdade.

; Limites úteis
mail.add_x_header = On         ; adiciona X-PHP-Originating-Script no cabeçalho
; mail.log = "C:/xampp/php/logs/mail.log"   ; loga TODA chamada a mail()`}),e.jsxs("p",{children:["Reinicie o Apache. Pronto — todo ",e.jsx("code",{children:"mail()"})," agora vai pelo Mercury."]}),e.jsx("h2",{children:"3. Testando o envio"}),e.jsx(a,{title:"htdocs/teste-email.php",language:"php",code:`<?php
$para = 'destinatario@meusite.local';
$assunto = 'Teste do XAMPP via Mercury';
$mensagem = "Se voce ta vendo isso, o Mercury entregou.\\nValeu!";
$headers = [
    'From: noreply@meusite.local',
    'Reply-To: noreply@meusite.local',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

if (mail($para, $assunto, $mensagem, implode("\\r\\n", $headers))) {
    echo 'Email passou para o Mercury com sucesso.';
} else {
    echo 'Falhou. Confira mercury rodando e php.ini configurado.';
    echo '<pre>' . print_r(error_get_last(), true) . '</pre>';
}`}),e.jsxs("p",{children:["Após acessar ",e.jsx("code",{children:"http://localhost/teste-email.php"}),", abra o Mercury → menu ",e.jsx("em",{children:"File → Queues"}),". A mensagem deve aparecer na fila de entrega. Se o destino é local (",e.jsx("code",{children:"@meusite.local"}),"), ela cai direto na caixa local em"," ",e.jsx("code",{children:"C:/xampp/MercuryMail/MAIL/<usuario>/"}),"."]}),e.jsx("h2",{children:"4. Caminho moderno: PHPMailer + Mercury (ou Mailtrap)"}),e.jsxs("p",{children:["A função ",e.jsx("code",{children:"mail()"})," do PHP é limitada (sem TLS nativo no Windows, anexos sofisticados são complicados, sem reaproveitar conexão). O padrão hoje é usar ",e.jsx("strong",{children:"PHPMailer"})," ou"," ",e.jsx("strong",{children:"Symfony Mailer"}),":"]}),e.jsx(a,{language:"bash",code:`composer require phpmailer/phpmailer
# ou
composer require symfony/mailer`}),e.jsx(a,{title:"enviar.php (PHPMailer)",language:"php",code:`<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\Exception;

$mail = new PHPMailer(true);
try {
    // Servidor SMTP — Mercury local
    $mail->isSMTP();
    $mail->Host       = 'localhost';
    $mail->Port       = 25;
    $mail->SMTPAuth   = false;
    $mail->CharSet    = 'UTF-8';
    // Em produção (SendGrid, Mailgun etc):
    // $mail->Host = 'smtp.sendgrid.net';
    // $mail->Port = 587;
    // $mail->SMTPAuth = true;
    // $mail->Username = 'apikey';
    // $mail->Password = getenv('SENDGRID_API_KEY');
    // $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->setFrom('noreply@meusite.local', 'Loja Local');
    $mail->addAddress('cliente@exemplo.com', 'Cliente Teste');
    $mail->addReplyTo('contato@meusite.local');

    $mail->isHTML(true);
    $mail->Subject = 'Pedido #1234 confirmado';
    $mail->Body    = '<h1>Obrigado!</h1><p>Seu pedido foi <b>confirmado</b>.</p>';
    $mail->AltBody = 'Obrigado! Seu pedido foi confirmado.';

    // Anexo
    // $mail->addAttachment(__DIR__ . '/boleto.pdf', 'boleto.pdf');

    $mail->send();
    echo 'Email enviado!';
} catch (Exception $e) {
    echo "Falha: {$mail->ErrorInfo}";
}`}),e.jsx(s,{title:"Configurar Mercury para enviar localmente",goal:"Conseguir disparar um email pelo PHP e vê-lo no Mercury.",steps:["Marque Mercury no instalador (ou reinstale o XAMPP marcando-o)","Painel → Start ao lado de Mercury","Abra o ícone do Mercury na bandeja","Em Configuration → Protocol Modules, confirme que MercuryS (SMTP) está habilitado","Edite php.ini: SMTP = localhost / smtp_port = 25 / sendmail_from = noreply@meusite.local","Reinicie o Apache","Crie htdocs/teste-email.php com mail() e acesse no navegador","No Mercury, clique em File → Queues e veja a fila de mensagens","Bônus: instale PHPMailer e mande um e-mail HTML com anexo"],verify:"O echo do PHP diz 'Email passou para o Mercury com sucesso' e a mensagem aparece em File → Queues do Mercury."}),e.jsx("h2",{children:"5. Alternativa moderna: MailHog / Mailpit"}),e.jsxs("p",{children:[e.jsx("strong",{children:"MailHog"})," é um SMTP fake com interface web bonita em"," ",e.jsx("code",{children:"http://localhost:8025"}),". Tudo que chega aparece numa caixa de entrada visual — perfeito para desenvolvimento. O projeto está parado, mas o sucessor ",e.jsx("strong",{children:"Mailpit"})," (mesmas ideias, ativamente mantido) é a recomendação atual."]}),e.jsx(a,{language:"bash",code:`# MailHog — baixe o binário em https://github.com/mailhog/MailHog/releases
# (escolha mailhog_windows_amd64.exe se Windows)
mailhog.exe
# SMTP: 1025  |  Web UI: 8025

# Mailpit (recomendado, mantido) — https://github.com/axllent/mailpit
# Baixe binário e rode:
mailpit
# SMTP: 1025  |  Web UI: 8025`}),e.jsx(a,{title:"php.ini com MailHog/Mailpit",language:"ini",code:`SMTP = localhost
smtp_port = 1025`}),e.jsxs("p",{children:["Acesse ",e.jsx("code",{children:"http://localhost:8025"})," para ver os e-mails — com preview HTML, raw source, anexos clicáveis e tudo."]}),e.jsx("h2",{children:"6. Alternativa em nuvem: Mailtrap"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Mailtrap.io"})," é um SMTP fake hospedado. Vantagem: sem instalar nada e o time todo enxerga a mesma caixa. Desvantagem: precisa de internet e tem cota mensal no plano grátis."]}),e.jsx(a,{title:".env do Laravel com Mailtrap",language:"bash",code:`MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=seu-usuario-do-painel
MAIL_PASSWORD=sua-senha
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=teste@meusite.local
MAIL_FROM_NAME="Loja Local"`}),e.jsx("h2",{children:"Erros comuns ao mexer com Mercury"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"could not connect to mail server"'})," — Mercury não está rodando, ou a porta 25 está bloqueada (antivírus, firewall do Windows)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Relaying denied"'})," — Mercury por padrão só aceita relay para domínios locais. Para mandar para fora (Gmail etc), precisa configurar em ",e.jsx("em",{children:"Configuration → Mercury Core (MercuryC) configuration"})," o servidor SMTP de saída (smarthost)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"mail() retorna true mas nada chega"})," — quase certo que o Mercury aceitou, tentou entregar e o destino recusou. Olhe a aba ",e.jsx("em",{children:"Core process queue"})," e os logs do Mercury (",e.jsx("code",{children:"mercury.log"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acentos zoados"})," — o cabeçalho"," ",e.jsx("code",{children:"Content-Type: text/plain; charset=UTF-8"})," precisa estar presente. Se o assunto também tem acento, codifique:"," ",e.jsx("code",{children:"=?UTF-8?B?'.base64_encode($assunto).'?="}),"."]})]}),e.jsxs(o,{type:"success",title:"Em produção, esqueça SMTP local",children:["Use serviços profissionais como ",e.jsx("strong",{children:"SendGrid"}),","," ",e.jsx("strong",{children:"Mailgun"}),", ",e.jsx("strong",{children:"Amazon SES"}),","," ",e.jsx("strong",{children:"Postmark"}),", ",e.jsx("strong",{children:"Resend"})," ou o SMTP da sua hospedagem. SMTP em IP residencial é bloqueado por quase todos os provedores (cai em spam ou nem entrega). E configure SPF, DKIM e DMARC no DNS do seu domínio — sem eles, mesmo um SendGrid bem configurado pode acabar marcado como suspeito."]})]})}export{u as default};
