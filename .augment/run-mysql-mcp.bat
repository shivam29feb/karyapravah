@echo off
echo Starting MySQL MCP Server... > C:\xampp\htdocs\karyapravah\workflow\.augment\mysql-mcp.log

set MYSQL_HOST=localhost
set MYSQL_PORT=3306
set MYSQL_USER=root
set MYSQL_PASS=ujkxco2920@
set MYSQL_DB=karyapravah

echo Environment variables set. >> C:\xampp\htdocs\karyapravah\workflow\.augment\mysql-mcp.log
echo Running MySQL MCP Server... >> C:\xampp\htdocs\karyapravah\workflow\.augment\mysql-mcp.log

"C:\Program Files\nodejs\node.exe" "%APPDATA%\npm\node_modules\@benborla29\mcp-server-mysql\dist\index.js" >> C:\xampp\htdocs\karyapravah\workflow\.augment\mysql-mcp.log 2>&1