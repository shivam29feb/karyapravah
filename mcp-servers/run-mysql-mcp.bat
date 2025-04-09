@echo off
echo Starting MySQL MCP Server...
set MYSQL_HOST=localhost
set MYSQL_PORT=3306
set MYSQL_USER=root
set MYSQL_PASS=ujkxco2920@
set MYSQL_DB=brijras_db
set PATH=%PATH%;%APPDATA%\npm
npx -y @benborla29/mcp-server-mysql
