/**
 * MCP Server Setup Script
 * 
 * This script helps set up and configure MCP servers for Augment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration for the MCP servers
const mcpServers = [
  {
    name: 'think-mcp-server',
    command: 'npx',
    args: ['@smithery/cli', 'run', '@PhillipRt/think-mcp-server', '--key', '48a1a836-25b3-4f2e-a88b-39b47c09b85a']
  },
  {
    name: 'mysql-mcp-server',
    command: 'npx',
    args: ['-y', '@benborla29/mcp-server-mysql'],
    env: {
      MYSQL_HOST: 'localhost',
      MYSQL_PORT: '3306',
      MYSQL_USER: 'root',
      MYSQL_PASS: 'ujkxco2920@',
      MYSQL_DB: 'sarasvishva'
    }
  }
];

/**
 * Create the .vscode directory if it doesn't exist
 */
function createVscodeDirectory() {
  const vscodeDir = path.join(process.cwd(), '.vscode');
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
    console.log('Created .vscode directory');
  }
}

/**
 * Create the .augment directory if it doesn't exist
 */
function createAugmentDirectory() {
  const augmentDir = path.join(process.cwd(), '.augment');
  if (!fs.existsSync(augmentDir)) {
    fs.mkdirSync(augmentDir, { recursive: true });
    console.log('Created .augment directory');
  }
}

/**
 * Create or update the settings.json file in the .vscode directory
 */
function updateVscodeSettings() {
  const settingsPath = path.join(process.cwd(), '.vscode', 'settings.json');
  let settings = {};
  
  // Read existing settings if the file exists
  if (fs.existsSync(settingsPath)) {
    try {
      const settingsContent = fs.readFileSync(settingsPath, 'utf8');
      settings = JSON.parse(settingsContent);
    } catch (error) {
      console.error('Error reading .vscode/settings.json:', error);
    }
  }
  
  // Update the settings with the MCP server configuration
  settings['augment.advanced'] = settings['augment.advanced'] || {};
  settings['augment.advanced']['mcpServers'] = mcpServers;
  
  // Write the updated settings back to the file
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log('Updated .vscode/settings.json with MCP server configuration');
  } catch (error) {
    console.error('Error writing .vscode/settings.json:', error);
  }
}

/**
 * Create or update the config.json file in the .augment directory
 */
function updateAugmentConfig() {
  const configPath = path.join(process.cwd(), '.augment', 'config.json');
  let config = {};
  
  // Read existing config if the file exists
  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(configContent);
    } catch (error) {
      console.error('Error reading .augment/config.json:', error);
    }
  }
  
  // Update the config with the MCP server configuration
  config['augment.advanced'] = config['augment.advanced'] || {};
  config['augment.advanced']['mcpServers'] = mcpServers;
  
  // Write the updated config back to the file
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('Updated .augment/config.json with MCP server configuration');
  } catch (error) {
    console.error('Error writing .augment/config.json:', error);
  }
}

/**
 * Create a batch file to run the MySQL MCP server
 */
function createMysqlMcpBatchFile() {
  const batchPath = path.join(process.cwd(), '.augment', 'run-mysql-mcp.bat');
  const batchContent = `@echo off
echo Starting MySQL MCP Server... > ${path.join(process.cwd(), '.augment', 'mysql-mcp.log')}

set MYSQL_HOST=localhost
set MYSQL_PORT=3306
set MYSQL_USER=root
set MYSQL_PASS=ujkxco2920@
set MYSQL_DB=sarasvishva

echo Environment variables set. >> ${path.join(process.cwd(), '.augment', 'mysql-mcp.log')}
echo Running MySQL MCP Server... >> ${path.join(process.cwd(), '.augment', 'mysql-mcp.log')}

"${process.env.PROGRAMFILES}\\nodejs\\node.exe" "%APPDATA%\\npm\\node_modules\\@benborla29\\mcp-server-mysql\\dist\\index.js" >> ${path.join(process.cwd(), '.augment', 'mysql-mcp.log')} 2>&1`;
  
  try {
    fs.writeFileSync(batchPath, batchContent);
    console.log('Created .augment/run-mysql-mcp.bat');
  } catch (error) {
    console.error('Error writing .augment/run-mysql-mcp.bat:', error);
  }
}

/**
 * Install the required npm packages
 */
function installPackages() {
  console.log('Installing required npm packages...');
  
  try {
    // Install the MySQL MCP server
    execSync('npm install -g @benborla29/mcp-server-mysql', { stdio: 'inherit' });
    console.log('Installed @benborla29/mcp-server-mysql globally');
    
    // Install the Smithery CLI
    execSync('npm install -g @smithery/cli', { stdio: 'inherit' });
    console.log('Installed @smithery/cli globally');
    
    // Install mysql2 for the database connector
    execSync('npm install mysql2', { stdio: 'inherit' });
    console.log('Installed mysql2 locally');
  } catch (error) {
    console.error('Error installing packages:', error);
  }
}

/**
 * Set environment variables for the MySQL MCP server
 */
function setEnvironmentVariables() {
  console.log('Setting environment variables...');
  
  try {
    // Set environment variables for the current process
    process.env.MYSQL_HOST = 'localhost';
    process.env.MYSQL_PORT = '3306';
    process.env.MYSQL_USER = 'root';
    process.env.MYSQL_PASS = 'ujkxco2920@';
    process.env.MYSQL_DB = 'sarasvishva';
    
    // Set environment variables for the user (Windows only)
    if (process.platform === 'win32') {
      execSync('setx MYSQL_HOST localhost', { stdio: 'inherit' });
      execSync('setx MYSQL_PORT 3306', { stdio: 'inherit' });
      execSync('setx MYSQL_USER root', { stdio: 'inherit' });
      execSync('setx MYSQL_PASS ujkxco2920@', { stdio: 'inherit' });
      execSync('setx MYSQL_DB sarasvishva', { stdio: 'inherit' });
    }
    
    console.log('Environment variables set');
  } catch (error) {
    console.error('Error setting environment variables:', error);
  }
}

/**
 * Main function to set up the MCP servers
 */
function setupMcpServers() {
  console.log('Setting up MCP servers...');
  
  // Create the necessary directories
  createVscodeDirectory();
  createAugmentDirectory();
  
  // Update the configuration files
  updateVscodeSettings();
  updateAugmentConfig();
  
  // Create the batch file for the MySQL MCP server
  createMysqlMcpBatchFile();
  
  // Install the required packages
  installPackages();
  
  // Set environment variables
  setEnvironmentVariables();
  
  console.log('MCP servers setup complete!');
  console.log('Please restart your editor for the changes to take effect.');
}

// If this script is run directly (not imported), execute the setup function
if (require.main === module) {
  setupMcpServers();
}

// Export functions for use in other scripts
module.exports = {
  createVscodeDirectory,
  createAugmentDirectory,
  updateVscodeSettings,
  updateAugmentConfig,
  createMysqlMcpBatchFile,
  installPackages,
  setEnvironmentVariables,
  setupMcpServers
};
