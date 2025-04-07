# Workflow System for AI Assistants

This folder contains a comprehensive workflow system that enables AI assistants like Augment to access databases, use MCP servers, and perform various tasks. Originally developed for the Sarasvishva project, this workflow system is designed to be portable and can be used in any project.

## Folder Structure

- `database-access/`: Scripts for connecting to and querying the MySQL database
- `mcp-servers/`: Scripts for setting up and running MCP servers for Augment
- `utilities/`: General utility functions and helper scripts

## Getting Started

### Initial Setup

1. **Clone or copy the workflow folder** to your project:

```bash
# If you're copying from an existing project
cp -r /path/to/original/workflow /path/to/your/project/

# Or if you're cloning from a repository
git clone https://github.com/username/workflow-system.git /path/to/your/project/workflow
```

2. **Configure the database connection** by editing `workflow/database-access/mysql-connector.js`:

```javascript
// Database configuration
const dbConfig = {
  host: 'localhost',     // Change to your database host
  port: 3306,            // Change to your database port
  user: 'root',          // Change to your database username
  password: 'password',  // Change to your database password
  database: 'your_db'    // Change to your database name
};
```

3. **Install dependencies**:

```bash
cd workflow
npm install
```

4. **Check and install required global dependencies**:

```bash
npm run check-deps
```

### Running the Workflow

1. **Set up MCP servers** (only needed once):

```bash
npm run setup-mcp
```

2. **Run MCP servers** (keep this terminal open while working with Augment):

```bash
npm run run-mcp
```

3. **Alternatively, use interactive mode** for a menu-driven interface:

```bash
npm run interactive
```

### Using from Parent Directory

If you're in the parent directory of the workflow folder, you can run commands like this:

```bash
node workflow/main.js run-mcp
```

## Available Commands

### NPM Scripts (Run from within the workflow directory)

- `npm start`: Show help and available commands
- `npm run check-deps`: Check and install required global dependencies
- `npm run setup-mcp`: Set up MCP servers for Augment
- `npm run run-mcp`: Run MCP servers for Augment
- `npm run stop-mcp`: Stop MCP servers for Augment
- `npm run list-tables`: List all tables in the database
- `npm run interactive`: Run in interactive mode with a menu-driven interface

### Direct Node Commands (Can be run from any directory)

- `node /path/to/workflow/main.js check-deps`: Check dependencies
- `node /path/to/workflow/main.js setup-mcp`: Set up MCP servers
- `node /path/to/workflow/main.js run-mcp`: Run MCP servers
- `node /path/to/workflow/main.js stop-mcp`: Stop MCP servers
- `node /path/to/workflow/main.js list-tables`: List database tables
- `node /path/to/workflow/main.js show-structure <tableName>`: Show table structure
- `node /path/to/workflow/main.js show-data <tableName> --limit <limit>`: Show table data
- `node /path/to/workflow/main.js query "<sql>"`: Execute a custom SQL query
- `node /path/to/workflow/main.js interactive`: Run in interactive mode

## Key Components

### Database Access

The `database-access` folder contains scripts for connecting to and querying the MySQL database:

- `mysql-connector.js`: Provides functions to connect to and query the MySQL database
- `query-database.js`: Demonstrates how to use the mysql-connector module to query the database

Example usage in your own scripts:

```javascript
// Import the database connector
const db = require('./workflow/database-access/mysql-connector');

async function main() {
  try {
    // List all tables
    const tables = await db.getTables();
    console.log('Tables:', tables);

    // Show structure of a table
    const structure = await db.getTableStructure('users');
    console.log('Structure of users table:', structure);

    // Show data in a table (limit to 10 records)
    const data = await db.getTableData('users', 10);
    console.log('Data in users table:', data);

    // Execute a custom query
    const results = await db.executeQuery('SELECT COUNT(*) as total_count FROM users');
    console.log('Total users:', results[0].total_count);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### MCP Servers

The `mcp-servers` folder contains scripts for setting up and running MCP servers for Augment:

- `setup-mcp-servers.js`: Helps set up and configure MCP servers for Augment
- `run-mcp-servers.js`: Helps run the MCP servers for Augment
- `check-dependencies.js`: Checks and installs required dependencies
- `run-think-mcp.bat` and `run-mysql-mcp.bat`: Batch files for running the MCP servers on Windows

The following MCP servers are configured:

1. **Think MCP Server**: Provides thinking capabilities for Augment
   - Allows the AI to perform structured thinking for complex problem-solving
   - Uses the Smithery MCP server from @PhillipRt/think-mcp-server

2. **MySQL MCP Server**: Provides access to the MySQL database for Augment
   - Allows the AI to query the database directly
   - Uses the @benborla29/mcp-server-mysql package

### Utilities

The `utilities` folder contains general utility functions and helper scripts:

- `helpers.js`: Provides general utility functions for the workflow, including:
  - File and directory management
  - Command and port checking
  - JSON file reading and writing
  - Date and time formatting

## Troubleshooting

### MCP Servers Not Working

If the MCP servers are not working properly, try the following:

1. **Check if the servers are running**:

```bash
# Windows
netstat -ano | findstr LISTENING

# Linux/Mac
netstat -tuln | grep LISTEN
```

2. **Check the log files** in the `.augment` directory:

```bash
# Windows
type .augment\mysql-mcp.log
type .augment\think-mcp.log

# Linux/Mac
cat .augment/mysql-mcp.log
cat .augment/think-mcp.log
```

3. **Make sure the environment variables are set correctly**:

```bash
# Windows
echo %MYSQL_HOST%
echo %MYSQL_PORT%
echo %MYSQL_USER%
echo %MYSQL_PASS%
echo %MYSQL_DB%

# Linux/Mac
echo $MYSQL_HOST
echo $MYSQL_PORT
echo $MYSQL_USER
echo $MYSQL_PASS
echo $MYSQL_DB
```

4. **Run the check-deps command** to ensure all dependencies are installed:

```bash
node workflow/main.js check-deps
```

5. **Restart your editor** after making changes to the configuration files.

### Database Connection Issues

If you're having issues connecting to the database, try the following:

1. **Check if the MySQL server is running**:

```bash
# Windows
netstat -ano | findstr 3306

# Linux/Mac
netstat -tuln | grep 3306
```

2. **Verify the database credentials** in `workflow/database-access/mysql-connector.js`.

3. **Test the database connection** directly:

```bash
# Windows/Linux/Mac
mysql -h localhost -u root -p
```

4. **Make sure the database exists**:

```bash
mysql -h localhost -u root -p -e "SHOW DATABASES;"
```

5. **Run the database test script**:

```bash
node workflow/database-access/query-database.js
```

## Using with Augment

Once the MCP servers are running, Augment will be able to:

1. **Use the Think MCP Server** for enhanced reasoning capabilities
2. **Access the MySQL database** through the MySQL MCP Server

You don't need to do anything special in your conversations with Augment - it will automatically use these capabilities when needed.

## Customization

You can customize this workflow system for your specific needs:

1. **Add more MCP servers** by modifying the `workflow/mcp-servers/run-mcp-servers.js` file
2. **Add more database functions** by extending the `workflow/database-access/mysql-connector.js` file
3. **Add more utility functions** by extending the `workflow/utilities/helpers.js` file
4. **Add more commands** by modifying the `workflow/main.js` file

## License

ISC
