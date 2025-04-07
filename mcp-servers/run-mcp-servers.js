/**
 * MCP Server Runner Script
 *
 * This script helps run the MCP servers for Augment.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Use shell option for Windows
const useShell = true;

// Get the full path to the Node.js executable
const nodePath = process.execPath;

// Configuration for the MCP servers
const mcpServers = [
  {
    name: 'think-mcp-server',
    command: path.join(__dirname, 'run-think-mcp.bat'),
    args: [],
    logFile: path.join(process.cwd(), '.augment', 'think-mcp.log')
  },
  {
    name: 'mysql-mcp-server',
    command: path.join(__dirname, 'run-mysql-mcp.bat'),
    args: [],
    env: {
      MYSQL_HOST: 'localhost',
      MYSQL_PORT: '3306',
      MYSQL_USER: 'root',
      MYSQL_PASS: 'ujkxco2920@',
      MYSQL_DB: 'sarasvishva'
    },
    logFile: path.join(process.cwd(), '.augment', 'mysql-mcp.log')
  }
];

// Store the spawned processes
const processes = {};

/**
 * Run an MCP server
 * @param {Object} server - The server configuration
 */
function runServer(server) {
  console.log(`Starting ${server.name}...`);
  console.log(`Command: ${server.command}`);
  console.log(`Args: ${server.args.join(' ')}`);

  // Create a log file stream
  const logStream = fs.createWriteStream(server.logFile, { flags: 'a' });
  logStream.write(`\n--- ${new Date().toISOString()} - Starting ${server.name} ---\n`);
  logStream.write(`Command: ${server.command}\n`);
  logStream.write(`Args: ${server.args.join(' ')}\n`);

  // Check if the command exists
  if (!fs.existsSync(server.command)) {
    const errorMsg = `Error: Command not found: ${server.command}`;
    console.error(errorMsg);
    logStream.write(`${errorMsg}\n`);
    logStream.end();
    return null;
  }

  // Set up the environment variables
  const env = { ...process.env, ...server.env };

  try {
    // Spawn the process
    const proc = spawn(server.command, server.args, { env, shell: useShell });

    // Store the process
    processes[server.name] = proc;

    // Handle process output
    proc.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[${server.name}] ${output}`);
      logStream.write(`[stdout] ${output}`);
    });

    proc.stderr.on('data', (data) => {
      const output = data.toString();
      console.error(`[${server.name}] Error: ${output}`);
      logStream.write(`[stderr] ${output}`);
    });

    // Handle process errors
    proc.on('error', (error) => {
      console.error(`[${server.name}] Process error: ${error.message}`);
      logStream.write(`[error] Process error: ${error.message}\n`);
      logStream.write(`Error details: ${JSON.stringify(error)}\n`);
      delete processes[server.name];
    });

    // Handle process exit
    proc.on('close', (code) => {
      console.log(`${server.name} exited with code ${code}`);
      logStream.write(`--- ${new Date().toISOString()} - ${server.name} exited with code ${code} ---\n`);
      logStream.end();
      delete processes[server.name];
    });

    return proc;
  } catch (error) {
    console.error(`Error starting ${server.name}: ${error.message}`);
    logStream.write(`Error starting ${server.name}: ${error.message}\n`);
    logStream.write(`Error details: ${JSON.stringify(error)}\n`);
    logStream.end();
    return null;
  }
}

/**
 * Stop an MCP server
 * @param {string} name - The name of the server to stop
 */
function stopServer(name) {
  if (processes[name]) {
    console.log(`Stopping ${name}...`);
    processes[name].kill();
  } else {
    console.log(`${name} is not running`);
  }
}

/**
 * Stop all running MCP servers
 */
function stopAllServers() {
  console.log('Stopping all MCP servers...');
  Object.keys(processes).forEach(stopServer);
}

/**
 * Run all MCP servers
 */
function runAllServers() {
  console.log('Starting all MCP servers...');

  // Create the .augment directory if it doesn't exist
  const augmentDir = path.join(process.cwd(), '.augment');
  if (!fs.existsSync(augmentDir)) {
    fs.mkdirSync(augmentDir, { recursive: true });
    console.log('Created .augment directory');
  }

  // Start each server and track success/failure
  const results = mcpServers.map(server => {
    const proc = runServer(server);
    return { name: server.name, success: proc !== null };
  });

  // Check if all servers started successfully
  const allSuccess = results.every(result => result.success);
  const failedServers = results.filter(result => !result.success).map(result => result.name);

  if (allSuccess) {
    console.log('All MCP servers started successfully. Press Ctrl+C to stop.');
  } else {
    console.error(`Failed to start the following MCP servers: ${failedServers.join(', ')}`);
    console.log('Check the log files in the .augment directory for more information.');
  }

  // Set up cleanup on exit
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Stopping all MCP servers...');
    stopAllServers();
    process.exit(0);
  });
}

// If this script is run directly (not imported), run all servers
if (require.main === module) {
  runAllServers();
}

// Export functions for use in other scripts
module.exports = {
  runServer,
  stopServer,
  stopAllServers,
  runAllServers
};
