/**
 * Main Workflow Script
 *
 * This script provides a command-line interface to the workflow functionality.
 */

const { program } = require('commander');
const inquirer = require('inquirer');
const { setupMcpServers } = require('./mcp-servers/setup-mcp-servers');
const { runAllServers, stopAllServers } = require('./mcp-servers/run-mcp-servers');
const { checkAndInstallDependencies } = require('./mcp-servers/check-dependencies');
const { listTables, showTableStructure, showTableData, executeCustomQuery } = require('./database-access/query-database');
const helpers = require('./utilities/helpers');

// Set up the command-line interface
program
  .version('1.0.0')
  .description('Workflow management for Sarasvishva project');

// Command to check dependencies
program
  .command('check-deps')
  .description('Check and install required dependencies')
  .action(() => {
    console.log('Checking dependencies...');
    checkAndInstallDependencies();
  });

// Command to set up MCP servers
program
  .command('setup-mcp')
  .description('Set up MCP servers for Augment')
  .action(() => {
    console.log('Setting up MCP servers...');
    checkAndInstallDependencies();
    setupMcpServers();
  });

// Command to run MCP servers
program
  .command('run-mcp')
  .description('Run MCP servers for Augment')
  .action(() => {
    console.log('Running MCP servers...');
    checkAndInstallDependencies();
    runAllServers();
  });

// Command to stop MCP servers
program
  .command('stop-mcp')
  .description('Stop MCP servers for Augment')
  .action(() => {
    console.log('Stopping MCP servers...');
    stopAllServers();
  });

// Command to list database tables
program
  .command('list-tables')
  .description('List all tables in the database')
  .action(async () => {
    console.log('Listing database tables...');
    await listTables();
  });

// Command to show table structure
program
  .command('show-structure <tableName>')
  .description('Show the structure of a table')
  .action(async (tableName) => {
    console.log(`Showing structure of table '${tableName}'...`);
    await showTableStructure(tableName);
  });

// Command to show table data
program
  .command('show-data <tableName>')
  .description('Show the data in a table')
  .option('-l, --limit <limit>', 'Maximum number of records to show', parseInt, 10)
  .action(async (tableName, options) => {
    console.log(`Showing data in table '${tableName}'...`);
    await showTableData(tableName, options.limit);
  });

// Command to execute a custom SQL query
program
  .command('query <sql>')
  .description('Execute a custom SQL query')
  .action(async (sql) => {
    console.log(`Executing SQL query: ${sql}`);
    await executeCustomQuery(sql);
  });

// Command to run the interactive mode
program
  .command('interactive')
  .description('Run in interactive mode')
  .action(async () => {
    console.log('Running in interactive mode...');
    await runInteractiveMode();
  });

// Interactive mode
async function runInteractiveMode() {
  console.log('Welcome to the Sarasvishva Workflow Interactive Mode');

  let exit = false;
  while (!exit) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Set up MCP servers', value: 'setup-mcp' },
          { name: 'Run MCP servers', value: 'run-mcp' },
          { name: 'Stop MCP servers', value: 'stop-mcp' },
          { name: 'List database tables', value: 'list-tables' },
          { name: 'Show table structure', value: 'show-structure' },
          { name: 'Show table data', value: 'show-data' },
          { name: 'Execute custom SQL query', value: 'query' },
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);

    switch (action) {
      case 'setup-mcp':
        setupMcpServers();
        break;
      case 'run-mcp':
        console.log('Running MCP servers in the background...');
        runAllServers();
        break;
      case 'stop-mcp':
        stopAllServers();
        break;
      case 'list-tables':
        await listTables();
        break;
      case 'show-structure':
        const tables = await listTables();
        if (tables && tables.length > 0) {
          const { tableName } = await inquirer.prompt([
            {
              type: 'list',
              name: 'tableName',
              message: 'Which table would you like to see the structure of?',
              choices: tables
            }
          ]);
          await showTableStructure(tableName);
        }
        break;
      case 'show-data':
        const dataTables = await listTables();
        if (dataTables && dataTables.length > 0) {
          const { tableName, limit } = await inquirer.prompt([
            {
              type: 'list',
              name: 'tableName',
              message: 'Which table would you like to see the data of?',
              choices: dataTables
            },
            {
              type: 'input',
              name: 'limit',
              message: 'How many records would you like to see?',
              default: '10',
              validate: (input) => {
                const limit = parseInt(input);
                return !isNaN(limit) && limit > 0 ? true : 'Please enter a valid positive number';
              }
            }
          ]);
          await showTableData(tableName, parseInt(limit));
        }
        break;
      case 'query':
        const { sql } = await inquirer.prompt([
          {
            type: 'input',
            name: 'sql',
            message: 'Enter your SQL query:',
            validate: (input) => input.trim().length > 0 ? true : 'Please enter a valid SQL query'
          }
        ]);
        await executeCustomQuery(sql);
        break;
      case 'exit':
        exit = true;
        break;
    }

    if (!exit) {
      const { continue: shouldContinue } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Would you like to perform another action?',
          default: true
        }
      ]);
      exit = !shouldContinue;
    }
  }

  console.log('Thank you for using the Sarasvishva Workflow Interactive Mode');
  process.exit(0);
}

// Parse command-line arguments
program.parse(process.argv);

// If no arguments are provided, show help
if (process.argv.length === 2) {
  program.help();
}
