import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function Tomcat() {
  return (
    <PageContainer
      title="Tomcat dentro do XAMPP — Java/JSP ao lado do PHP"
      subtitle="O XAMPP traz um Tomcat opcional. Como instalar o add-on, subir como serviço, fazer deploy de WARs e integrar com o Apache via mod_jk."
      difficulty="avancado"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Quando faz sentido?">
        Você mantém uma aplicação Java legada (Servlet/JSP/Spring) e quer rodar ao lado do site
        PHP no mesmo XAMPP — sem instalar JDK/Tomcat separados.
      </AlertBox>

      <h2>O Tomcat NÃO vem por padrão</h2>
      <p>
        Hoje (XAMPP 8.x) ele é distribuído como <strong>add-on</strong> separado:
      </p>
      <CodeBlock
        language="text"
        code={`1. https://www.apachefriends.org/add-ons.html
2. Baixe "Tomcat XAMPP Add-On"
3. Execute o instalador — ele detecta o XAMPP existente e cria
   C:/xampp/tomcat/  (Win) ou /opt/lampp/tomcat/  (Linux)`}
      />
      <p>Depois do install, o painel do XAMPP exibe o botão Tomcat / Start.</p>

      <h2>Estrutura de pastas</h2>
      <CodeBlock
        language="text"
        code={`C:/xampp/tomcat/
├── bin/                    ← scripts (catalina.bat, startup.bat)
├── conf/
│   ├── server.xml          ← portas, hosts, conectores
│   ├── web.xml             ← config global
│   └── tomcat-users.xml    ← usuários do manager
├── lib/                    ← jars compartilhados
├── logs/                   ← catalina.out, localhost.log
├── webapps/                ← deploy: pasta ou .war
└── work/                   ← cache de JSPs compiladas`}
      />

      <h2>Subindo</h2>
      <CodeBlock
        title="Pelo console"
        language="bash"
        code={`# Windows
C:/xampp/tomcat/bin/startup.bat
C:/xampp/tomcat/bin/shutdown.bat

# Linux
/opt/lampp/lampp starttomcat
/opt/lampp/lampp stoptomcat

# Logs
tail -f C:/xampp/tomcat/logs/catalina.out`}
      />
      <p>
        Acesse <code>http://localhost:8080/</code> — página padrão do Tomcat. Se conflita com
        outro serviço na 8080, mude a porta no <code>server.xml</code>.
      </p>

      <h2>Variáveis de ambiente</h2>
      <CodeBlock
        title="setenv.bat — em bin/"
        language="text"
        code={`@echo off
set "JAVA_HOME=C:\\Program Files\\Java\\jdk-21"
set "JRE_HOME=%JAVA_HOME%"
set "CATALINA_OPTS=-Xms512m -Xmx2g -XX:MaxMetaspaceSize=512m -Dfile.encoding=UTF-8"
set "JAVA_OPTS=-Duser.timezone=America/Sao_Paulo"`}
      />
      <CodeBlock
        title="setenv.sh — Linux/macOS"
        language="bash"
        code={`#!/bin/sh
export JAVA_HOME=/usr/lib/jvm/java-21
export CATALINA_OPTS="-Xms512m -Xmx2g -XX:MaxMetaspaceSize=512m"`}
      />

      <h2>Mudando portas</h2>
      <CodeBlock
        title="conf/server.xml — trechos relevantes"
        language="xml"
        code={`<!-- Shutdown -->
<Server port="8005" shutdown="SHUTDOWN">

<!-- HTTP -->
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443"
           URIEncoding="UTF-8" />

<!-- AJP (para mod_jk do Apache) -->
<Connector port="8009" protocol="AJP/1.3"
           secretRequired="false"
           address="127.0.0.1" />

<!-- HTTPS -->
<Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol"
           SSLEnabled="true"
           maxThreads="150" scheme="https" secure="true">
    <SSLHostConfig>
        <Certificate certificateKeystoreFile="conf/localhost-rsa.jks"
                     type="RSA" />
    </SSLHostConfig>
</Connector>`}
      />

      <h2>Deploy de aplicação</h2>
      <ParamsTable
        title="Três formas"
        params={[
          { flag: "WAR em webapps/", desc: "Coloque app.war e Tomcat extrai automaticamente em /app." },
          { flag: "Pasta exploded", desc: "Copie webapps/app/ com WEB-INF/web.xml dentro." },
          { flag: "context.xml", desc: "Aponte uma pasta arbitrária criando conf/Catalina/localhost/app.xml." },
        ]}
      />
      <CodeBlock
        title="conf/Catalina/localhost/loja.xml — externo"
        language="xml"
        code={`<Context docBase="C:/projetos/loja-java/build" path="/loja"
         reloadable="true" />`}
      />

      <h2>Manager — ativar para deploy via web</h2>
      <CodeBlock
        title="conf/tomcat-users.xml"
        language="xml"
        code={`<tomcat-users>
    <role rolename="manager-gui"/>
    <role rolename="manager-script"/>
    <user username="admin" password="senha_forte"
          roles="manager-gui,manager-script"/>
</tomcat-users>`}
      />
      <p>
        Por padrão, o manager está bloqueado para localhost only. Se precisar liberar de fora,
        edite <code>webapps/manager/META-INF/context.xml</code> — mas tenha senha forte.
      </p>
      <CodeBlock
        title="Deploy via curl"
        language="bash"
        code={`curl --upload-file loja.war \\
     -u admin:senha_forte \\
     "http://localhost:8080/manager/text/deploy?path=/loja&update=true"`}
      />

      <h2>Servlet rápido para teste</h2>
      <CodeBlock
        title="webapps/teste/WEB-INF/web.xml"
        language="xml"
        code={`<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         version="6.0">
    <servlet>
        <servlet-name>ola</servlet-name>
        <servlet-class>com.exemplo.Ola</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ola</servlet-name>
        <url-pattern>/ola</url-pattern>
    </servlet-mapping>
</web-app>`}
      />
      <CodeBlock
        title="WEB-INF/classes/com/exemplo/Ola.java"
        language="java"
        code={`package com.exemplo;
import jakarta.servlet.http.*;
import jakarta.servlet.*;
import java.io.*;

public class Ola extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
        throws IOException {
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("<h1>Olá do Servlet!</h1>");
    }
}`}
      />
      <CodeBlock
        language="bash"
        code={`# Compile (com JDK no PATH)
cd webapps/teste/WEB-INF/classes
javac -cp "C:/xampp/tomcat/lib/servlet-api.jar" com/exemplo/Ola.java

# Reinicie ou marque reloadable=true
# Acesse http://localhost:8080/teste/ola`}
      />

      <h2>Apache + Tomcat via mod_jk</h2>
      <p>
        Para ter Tomcat acessível em <code>http://meusite.local/app</code> (sem porta 8080):
      </p>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`LoadModule jk_module modules/mod_jk.so

JkWorkersFile  conf/workers.properties
JkLogFile      logs/mod_jk.log
JkLogLevel     info

# Quais URLs vão pro Tomcat
JkMount /app/*    worker1
JkMount /admin/*  worker1`}
      />
      <CodeBlock
        title="conf/workers.properties"
        language="ini"
        code={`worker.list=worker1
worker.worker1.type=ajp13
worker.worker1.host=127.0.0.1
worker.worker1.port=8009
worker.worker1.connection_pool_size=10
worker.worker1.connection_pool_timeout=600`}
      />
      <p>
        Alternativa moderna: <code>mod_proxy_ajp</code> + <code>ProxyPass /app
        ajp://127.0.0.1:8009/app</code>.
      </p>

      <h2>Logs</h2>
      <CodeBlock
        language="text"
        code={`logs/
├── catalina.out                    ← stdout/stderr (mais útil)
├── catalina.YYYY-MM-DD.log         ← rotacionado por dia
├── localhost.YYYY-MM-DD.log        ← do host localhost
├── manager.YYYY-MM-DD.log          ← deploys/undeploys do manager
└── localhost_access_log.YYYY-MM-DD.txt   ← access log estilo Apache`}
      />

      <h2>JNDI — datasource MariaDB no Tomcat</h2>
      <CodeBlock
        title="webapps/app/META-INF/context.xml"
        language="xml"
        code={`<Context>
    <Resource name="jdbc/Loja"
              auth="Container"
              type="javax.sql.DataSource"
              maxTotal="20" maxIdle="10" maxWaitMillis="10000"
              username="app_loja" password="senha"
              driverClassName="org.mariadb.jdbc.Driver"
              url="jdbc:mariadb://127.0.0.1:3306/loja"/>
</Context>`}
      />
      <p>
        Coloque o jar do MariaDB JDBC em <code>tomcat/lib/</code> e configure ResourceRef no{" "}
        <code>web.xml</code> da aplicação.
      </p>

      <AlertBox type="warning" title="Memória do Tomcat">
        O Tomcat fica facilmente em 500MB+ de RAM. No XAMPP local, libere recursos do Apache (MPM
        ajustado) e ajuste <code>Xmx</code> com sensatez.
      </AlertBox>

      <h2>Quando NÃO usar</h2>
      <ul>
        <li>Aplicação stateless leve — Spring Boot embarca seu próprio Tomcat (mais simples).</li>
        <li>Microserviços com Docker — gerencie via container, não via XAMPP.</li>
        <li>Preferência por Quarkus/Micronaut/Helidon — runtimes mais modernos.</li>
      </ul>

      <h2>Armadilhas</h2>
      <ul>
        <li>JDK errado — Tomcat 11 exige Java 17+. JDK 8 não roda.</li>
        <li>Porta 8080 ocupada por outro serviço (Jenkins?). Mude no server.xml.</li>
        <li><code>JAVA_HOME</code> mal configurado — Tomcat sobe e morre sem mensagem clara.</li>
        <li>Esquecer reload após mudar context.xml — limpe pasta <code>work/</code>.</li>
      </ul>
    </PageContainer>
  );
}
