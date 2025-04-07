@echo off
echo Starting Think MCP Server...
set PATH=%PATH%;%APPDATA%\npm
npx @smithery/cli run @PhillipRt/think-mcp-server --key 48a1a836-25b3-4f2e-a88b-39b47c09b85a
