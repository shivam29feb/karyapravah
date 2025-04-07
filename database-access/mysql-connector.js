/**
 * MySQL Database Connector
 * 
 * This module provides functions to connect to and query the MySQL database.
 */

const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'ujkxco2920@',
  database: 'sarasvishva'
};

/**
 * Create a connection to the database
 * @returns {Promise<mysql.Connection>} A promise that resolves to a database connection
 */
async function createConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Successfully connected to the MySQL database!');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

/**
 * Execute a query on the database
 * @param {string} sql - The SQL query to execute
 * @param {Array} params - The parameters for the query (optional)
 * @returns {Promise<Array>} A promise that resolves to the query results
 */
async function executeQuery(sql, params = []) {
  let connection;
  try {
    connection = await createConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Get all tables in the database
 * @returns {Promise<Array>} A promise that resolves to an array of table names
 */
async function getTables() {
  return executeQuery('SHOW TABLES');
}

/**
 * Get the structure of a table
 * @param {string} tableName - The name of the table
 * @returns {Promise<Array>} A promise that resolves to the table structure
 */
async function getTableStructure(tableName) {
  return executeQuery(`DESCRIBE ${tableName}`);
}

/**
 * Get all records from a table
 * @param {string} tableName - The name of the table
 * @param {number} limit - The maximum number of records to return (optional)
 * @returns {Promise<Array>} A promise that resolves to the table records
 */
async function getTableData(tableName, limit = 100) {
  return executeQuery(`SELECT * FROM ${tableName} LIMIT ${limit}`);
}

module.exports = {
  createConnection,
  executeQuery,
  getTables,
  getTableStructure,
  getTableData
};
