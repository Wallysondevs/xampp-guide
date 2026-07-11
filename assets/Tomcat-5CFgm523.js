import{j as e}from"./index-BreI0dyu.js";import{P as t,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function p(){return e.jsxs(t,{title:"Tomcat dentro do XAMPP — Java/JSP ao lado do PHP",subtitle:"O XAMPP traz um Tomcat opcional. Como instalar o add-on, subir como serviço, fazer deploy de WARs e integrar com o Apache via mod_jk.",difficulty:"avancado",timeToRead:"11 min",children:[e.jsx(o,{type:"info",title:"Quando faz sentido?",children:"Você mantém uma aplicação Java legada (Servlet/JSP/Spring) e quer rodar ao lado do site PHP no mesmo XAMPP — sem instalar JDK/Tomcat separados."}),e.jsx("h2",{children:"O Tomcat NÃO vem por padrão"}),e.jsxs("p",{children:["Hoje (XAMPP 8.x) ele é distribuído como ",e.jsx("strong",{children:"add-on"})," separado:"]}),e.jsx(a,{language:"text",code:`1. https://www.apachefriends.org/add-ons.html
2. Baixe "Tomcat XAMPP Add-On"
3. Execute o instalador — ele detecta o XAMPP existente e cria
   C:/xampp/tomcat/  (Win) ou /opt/lampp/tomcat/  (Linux)`}),e.jsx("p",{children:"Depois do install, o painel do XAMPP exibe o botão Tomcat / Start."}),e.jsx("h2",{children:"Estrutura de pastas"}),e.jsx(a,{language:"text",code:`C:/xampp/tomcat/
├── bin/                    ← scripts (catalina.bat, startup.bat)
├── conf/
│   ├── server.xml          ← portas, hosts, conectores
│   ├── web.xml             ← config global
│   └── tomcat-users.xml    ← usuários do manager
├── lib/                    ← jars compartilhados
├── logs/                   ← catalina.out, localhost.log
├── webapps/                ← deploy: pasta ou .war
└── work/                   ← cache de JSPs compiladas`}),e.jsx("h2",{children:"Subindo"}),e.jsx(a,{title:"Pelo console",language:"bash",code:`# Windows
C:/xampp/tomcat/bin/startup.bat
C:/xampp/tomcat/bin/shutdown.bat

# Linux
/opt/lampp/lampp starttomcat
/opt/lampp/lampp stoptomcat

# Logs
tail -f C:/xampp/tomcat/logs/catalina.out`}),e.jsxs("p",{children:["Acesse ",e.jsx("code",{children:"http://localhost:8080/"})," — página padrão do Tomcat. Se conflita com outro serviço na 8080, mude a porta no ",e.jsx("code",{children:"server.xml"}),"."]}),e.jsx("h2",{children:"Variáveis de ambiente"}),e.jsx(a,{title:"setenv.bat — em bin/",language:"text",code:`@echo off
set "JAVA_HOME=C:\\Program Files\\Java\\jdk-21"
set "JRE_HOME=%JAVA_HOME%"
set "CATALINA_OPTS=-Xms512m -Xmx2g -XX:MaxMetaspaceSize=512m -Dfile.encoding=UTF-8"
set "JAVA_OPTS=-Duser.timezone=America/Sao_Paulo"`}),e.jsx(a,{title:"setenv.sh — Linux/macOS",language:"bash",code:`#!/bin/sh
export JAVA_HOME=/usr/lib/jvm/java-21
export CATALINA_OPTS="-Xms512m -Xmx2g -XX:MaxMetaspaceSize=512m"`}),e.jsx("h2",{children:"Mudando portas"}),e.jsx(a,{title:"conf/server.xml — trechos relevantes",language:"xml",code:`<!-- Shutdown -->
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
</Connector>`}),e.jsx("h2",{children:"Deploy de aplicação"}),e.jsx(r,{title:"Três formas",params:[{flag:"WAR em webapps/",desc:"Coloque app.war e Tomcat extrai automaticamente em /app."},{flag:"Pasta exploded",desc:"Copie webapps/app/ com WEB-INF/web.xml dentro."},{flag:"context.xml",desc:"Aponte uma pasta arbitrária criando conf/Catalina/localhost/app.xml."}]}),e.jsx(a,{title:"conf/Catalina/localhost/loja.xml — externo",language:"xml",code:`<Context docBase="C:/projetos/loja-java/build" path="/loja"
         reloadable="true" />`}),e.jsx("h2",{children:"Manager — ativar para deploy via web"}),e.jsx(a,{title:"conf/tomcat-users.xml",language:"xml",code:`<tomcat-users>
    <role rolename="manager-gui"/>
    <role rolename="manager-script"/>
    <user username="admin" password="senha_forte"
          roles="manager-gui,manager-script"/>
</tomcat-users>`}),e.jsxs("p",{children:["Por padrão, o manager está bloqueado para localhost only. Se precisar liberar de fora, edite ",e.jsx("code",{children:"webapps/manager/META-INF/context.xml"})," — mas tenha senha forte."]}),e.jsx(a,{title:"Deploy via curl",language:"bash",code:`curl --upload-file loja.war \\
     -u admin:senha_forte \\
     "http://localhost:8080/manager/text/deploy?path=/loja&update=true"`}),e.jsx("h2",{children:"Servlet rápido para teste"}),e.jsx(a,{title:"webapps/teste/WEB-INF/web.xml",language:"xml",code:`<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         version="6.0">
    <servlet>
        <servlet-name>ola</servlet-name>
        <servlet-class>com.exemplo.Ola</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ola</servlet-name>
        <url-pattern>/ola</url-pattern>
    </servlet-mapping>
</web-app>`}),e.jsx(a,{title:"WEB-INF/classes/com/exemplo/Ola.java",language:"java",code:`package com.exemplo;
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
}`}),e.jsx(a,{language:"bash",code:`# Compile (com JDK no PATH)
cd webapps/teste/WEB-INF/classes
javac -cp "C:/xampp/tomcat/lib/servlet-api.jar" com/exemplo/Ola.java

# Reinicie ou marque reloadable=true
# Acesse http://localhost:8080/teste/ola`}),e.jsx("h2",{children:"Apache + Tomcat via mod_jk"}),e.jsxs("p",{children:["Para ter Tomcat acessível em ",e.jsx("code",{children:"http://meusite.local/app"})," (sem porta 8080):"]}),e.jsx(a,{title:"httpd.conf",language:"apache",code:`LoadModule jk_module modules/mod_jk.so

JkWorkersFile  conf/workers.properties
JkLogFile      logs/mod_jk.log
JkLogLevel     info

# Quais URLs vão pro Tomcat
JkMount /app/*    worker1
JkMount /admin/*  worker1`}),e.jsx(a,{title:"conf/workers.properties",language:"ini",code:`worker.list=worker1
worker.worker1.type=ajp13
worker.worker1.host=127.0.0.1
worker.worker1.port=8009
worker.worker1.connection_pool_size=10
worker.worker1.connection_pool_timeout=600`}),e.jsxs("p",{children:["Alternativa moderna: ",e.jsx("code",{children:"mod_proxy_ajp"})," + ",e.jsx("code",{children:"ProxyPass /app ajp://127.0.0.1:8009/app"}),"."]}),e.jsx("h2",{children:"Logs"}),e.jsx(a,{language:"text",code:`logs/
├── catalina.out                    ← stdout/stderr (mais útil)
├── catalina.YYYY-MM-DD.log         ← rotacionado por dia
├── localhost.YYYY-MM-DD.log        ← do host localhost
├── manager.YYYY-MM-DD.log          ← deploys/undeploys do manager
└── localhost_access_log.YYYY-MM-DD.txt   ← access log estilo Apache`}),e.jsx("h2",{children:"JNDI — datasource MariaDB no Tomcat"}),e.jsx(a,{title:"webapps/app/META-INF/context.xml",language:"xml",code:`<Context>
    <Resource name="jdbc/Loja"
              auth="Container"
              type="javax.sql.DataSource"
              maxTotal="20" maxIdle="10" maxWaitMillis="10000"
              username="app_loja" password="senha"
              driverClassName="org.mariadb.jdbc.Driver"
              url="jdbc:mariadb://127.0.0.1:3306/loja"/>
</Context>`}),e.jsxs("p",{children:["Coloque o jar do MariaDB JDBC em ",e.jsx("code",{children:"tomcat/lib/"})," e configure ResourceRef no"," ",e.jsx("code",{children:"web.xml"})," da aplicação."]}),e.jsxs(o,{type:"warning",title:"Memória do Tomcat",children:["O Tomcat fica facilmente em 500MB+ de RAM. No XAMPP local, libere recursos do Apache (MPM ajustado) e ajuste ",e.jsx("code",{children:"Xmx"})," com sensatez."]}),e.jsx("h2",{children:"Quando NÃO usar"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Aplicação stateless leve — Spring Boot embarca seu próprio Tomcat (mais simples)."}),e.jsx("li",{children:"Microserviços com Docker — gerencie via container, não via XAMPP."}),e.jsx("li",{children:"Preferência por Quarkus/Micronaut/Helidon — runtimes mais modernos."})]}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"JDK errado — Tomcat 11 exige Java 17+. JDK 8 não roda."}),e.jsx("li",{children:"Porta 8080 ocupada por outro serviço (Jenkins?). Mude no server.xml."}),e.jsxs("li",{children:[e.jsx("code",{children:"JAVA_HOME"})," mal configurado — Tomcat sobe e morre sem mensagem clara."]}),e.jsxs("li",{children:["Esquecer reload após mudar context.xml — limpe pasta ",e.jsx("code",{children:"work/"}),"."]})]})]})}export{p as default};
