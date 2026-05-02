import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MigrarProducao() {
  return (
    <PageContainer
      title="Migrando do XAMPP para produção"
      subtitle="Quando seu projeto está pronto, é hora de tirar do localhost. Aqui está o checklist."
      difficulty="avancado"
      timeToRead="9 min"
    >
      <p>
        Migrar localhost → produção é um momento delicado. URLs mudam, senhas
        mudam, charsets podem mudar, certificados precisam ser configurados.
        Este capítulo é o checklist para você não esquecer nada.
      </p>

      <h2>Antes de tudo: escolher onde hospedar</h2>
      <ParamsTable
        title="Tipos de hospedagem para PHP+MySQL"
        params={[
          { flag: "Hospedagem compartilhada", desc: "Hostinger, HostGator, KingHost. Já vem com cPanel, Apache, PHP, MySQL. Pra projetos pequenos é o caminho mais barato e fácil. ~R$ 15-50/mês." },
          { flag: "VPS (Virtual Private Server)", desc: "DigitalOcean, Vultr, Linode, AWS Lightsail. Você tem o servidor todo. Mais controle, mais responsabilidade (precisa configurar Apache/Nginx, certbot, segurança). De R$ 30/mês pra cima." },
          { flag: "Cloud (AWS, GCP, Azure)", desc: "Para escala maior. Custos variáveis, mais complexo. Só vale se já tem conhecimento ou volume." },
          { flag: "Plataformas como serviço", desc: "Heroku, Railway, Render, Fly.io. Você só faz push do Git, eles cuidam do resto. Para PHP é menos comum, mas existe." },
        ]}
      />

      <h2>Checklist de migração</h2>

      <h3>1. Backup completo do XAMPP</h3>
      <ul>
        <li>Pasta inteira do projeto em <code>htdocs/seu-projeto/</code>.</li>
        <li>Dump do banco via mysqldump (<a href="#/mysql-backup">veja Backup</a>).</li>
        <li>Cópia do <code>.env</code>, mas com a senha já trocada para a senha de produção.</li>
      </ul>

      <h3>2. Subir os arquivos</h3>
      <p>Pelos clientes mais comuns:</p>
      <CodeBlock language="bash" code={`# Via FileZilla / cPanel File Manager
# Suba o conteúdo de htdocs/seu-projeto/ para public_html/ (ou /var/www/html/)

# Via Git (recomendado)
# Local:
git add .
git commit -m "Pronto para deploy"
git push

# No servidor:
git clone https://github.com/seu-usuario/seu-projeto.git public_html

# Via SCP (Linux/macOS)
scp -r ./meu-app usuario@servidor.com:/var/www/html/`} />

      <h3>3. Importar o banco</h3>
      <CodeBlock language="bash" code={`# Suba o dump.sql para o servidor

# Importe no MySQL de produção
mysql -u usuario_prod -p banco_prod < dump.sql

# Em hospedagem compartilhada, use o phpMyAdmin do cPanel`} />

      <h3>4. Trocar credenciais e URLs</h3>
      <p>Edite o <code>.env</code> (Laravel) ou <code>config.php</code> (CMS) no servidor:</p>
      <CodeBlock language="bash" code={`APP_ENV=production
APP_DEBUG=false           ← MUITO importante
APP_URL=https://meusite.com.br

DB_HOST=mysql.hosting.com
DB_DATABASE=usuario_banco_prod
DB_USERNAME=usuario_db
DB_PASSWORD=senha_super_forte_diferente_da_local`} />

      <h3>5. WordPress: trocar URLs no banco</h3>
      <p>Se for WP, as URLs ficam SALVAS no banco. Use:</p>
      <CodeBlock language="sql" code={`-- Pelo phpMyAdmin do cPanel ou pelo terminal
UPDATE wp_options SET option_value = 'https://meusite.com.br'
    WHERE option_name = 'siteurl';
UPDATE wp_options SET option_value = 'https://meusite.com.br'
    WHERE option_name = 'home';

UPDATE wp_posts SET guid = REPLACE(guid,
    'http://localhost/wordpress', 'https://meusite.com.br');

UPDATE wp_posts SET post_content = REPLACE(post_content,
    'http://localhost/wordpress', 'https://meusite.com.br');

UPDATE wp_postmeta SET meta_value = REPLACE(meta_value,
    'http://localhost/wordpress', 'https://meusite.com.br');`} />
      <p>Ou use o plugin <strong>Better Search Replace</strong> (interface gráfica).</p>

      <h3>6. Habilitar HTTPS no servidor</h3>
      <CodeBlock language="bash" code={`# Em cPanel: AutoSSL faz tudo sozinho.
# Em VPS Ubuntu/Debian:
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d meusite.com.br -d www.meusite.com.br

# Renovação automática já fica configurada via cron`} />

      <h3>7. Forçar HTTPS no .htaccess</h3>
      <CodeBlock language="apache" code={`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`} />

      <h3>8. Permissões corretas</h3>
      <CodeBlock language="bash" code={`# Linux — proprietário do Apache
sudo chown -R www-data:www-data /var/www/html
sudo find /var/www/html -type d -exec chmod 755 {} \\;
sudo find /var/www/html -type f -exec chmod 644 {} \\;

# Storage do Laravel: 775
sudo chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache`} />

      <h3>9. Configurar PHP de produção</h3>
      <CodeBlock language="ini" code={`; php.ini de produção
display_errors = Off
display_startup_errors = Off
log_errors = On
expose_php = Off

; OPcache ligado e ajustado
opcache.enable = 1
opcache.memory_consumption = 256
opcache.validate_timestamps = 0   ; em prod, false; recompila só com restart`} />

      <h3>10. Testar tudo</h3>
      <ul>
        <li>Login do admin funciona?</li>
        <li>Envio de formulário e email?</li>
        <li>Upload de arquivos?</li>
        <li>Pagamentos (se houver)?</li>
        <li>HTTPS realmente força redirect?</li>
        <li>404 personalizado abre?</li>
      </ul>

      <AlertBox type="danger" title="Lembre-se de tirar coisas que só são pra dev">
        Senha vazia, debug=true, mensagens de erro na tela, phpinfo.php
        público, mod_status aberto, dump.sql na raiz... Vasculhe o projeto
        antes de subir.
      </AlertBox>

      <AlertBox type="success" title="Pós-deploy: monitore">
        Logue tudo (<code>error_log</code>, logs do Apache, logs do banco) e
        confira nos primeiros dias. Configure backup automático no servidor
        — não dependa só do "no meu PC tem".
      </AlertBox>
    </PageContainer>
  );
}
