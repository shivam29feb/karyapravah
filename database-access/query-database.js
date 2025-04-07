/**
 * Database Query Script
 * 
 * This script demonstrates how to use the mysql-connector module to query the database.
 */

const db = require('./mysql-connector');

/**
 * Display the results of a query in a formatted way
 * @param {Array} results - The query results
 */
function displayResults(results) {
  console.log(JSON.stringify(results, null, 2));
}

/**
 * List all tables in the database
 */
async function listTables() {
  try {
    console.log('Listing all tables in the database:');
    const tables = await db.getTables();
    
    // Format the results for better readability
    const tableNames = tables.map(table => {
      // Extract the table name from the first value in each row
      const key = Object.keys(table)[0];
      return table[key];
    });
    
    console.log('Tables:');
    tableNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    
    return tableNames;
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

/**
 * Show the structure of a table
 * @param {string} tableName - The name of the table
 */
async function showTableStructure(tableName) {
  try {
    console.log(`\nStructure of table '${tableName}':`);
    const structure = await db.getTableStructure(tableName);
    displayResults(structure);
    return structure;
  } catch (error) {
    console.error(`Error showing structure of table '${tableName}':`, error);
  }
}

/**
 * Show the data in a table
 * @param {string} tableName - The name of the table
 * @param {number} limit - The maximum number of records to show
 */
async function showTableData(tableName, limit = 10) {
  try {
    console.log(`\nData in table '${tableName}' (limited to ${limit} records):`);
    const data = await db.getTableData(tableName, limit);
    displayResults(data);
    return data;
  } catch (error) {
    console.error(`Error showing data in table '${tableName}':`, error);
  }
}

/**
 * Execute a custom SQL query
 * @param {string} sql - The SQL query to execute
 * @param {Array} params - The parameters for the query
 */
async function executeCustomQuery(sql, params = []) {
  try {
    console.log(`\nExecuting custom query: ${sql}`);
    const results = await db.executeQuery(sql, params);
    displayResults(results);
    return results;
  } catch (error) {
    console.error('Error executing custom query:', error);
  }
}

/**
 * Main function to demonstrate the usage of the module
 */
async function main() {
  try {
    // List all tables
    const tables = await listTables();
    
    if (tables && tables.length > 0) {
      // Show structure of the first table
      await showTableStructure(tables[0]);
      
      // Show data in the first table
      await showTableData(tables[0]);
      
      // Execute a custom query (example)
      await executeCustomQuery('SELECT COUNT(*) as total_count FROM ??', [tables[0]]);
    }
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    process.exit(0);
  }
}

// If this script is run directly (not imported), execute the main function
if (require.main === module) {
  main();
}

// Export functions for use in other scripts
module.exports = {
  listTables,
  showTableStructure,
  showTableData,
  executeCustomQuery
};
