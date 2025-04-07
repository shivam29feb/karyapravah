/**
 * Helper Utilities
 * 
 * This module provides general utility functions for the workflow.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Check if a command is available in the system
 * @param {string} command - The command to check
 * @returns {boolean} True if the command is available, false otherwise
 */
function isCommandAvailable(command) {
  try {
    if (process.platform === 'win32') {
      // On Windows, use where command
      execSync(`where ${command}`);
    } else {
      // On Unix-like systems, use which command
      execSync(`which ${command}`);
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the full path to a command
 * @param {string} command - The command to find
 * @returns {string|null} The full path to the command, or null if not found
 */
function getCommandPath(command) {
  try {
    if (process.platform === 'win32') {
      // On Windows, use where command
      return execSync(`where ${command}`).toString().trim().split('\n')[0];
    } else {
      // On Unix-like systems, use which command
      return execSync(`which ${command}`).toString().trim();
    }
  } catch (error) {
    return null;
  }
}

/**
 * Check if a port is in use
 * @param {number} port - The port to check
 * @returns {boolean} True if the port is in use, false otherwise
 */
function isPortInUse(port) {
  try {
    if (process.platform === 'win32') {
      // On Windows, use netstat command
      const output = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`).toString();
      return output.length > 0;
    } else {
      // On Unix-like systems, use lsof command
      const output = execSync(`lsof -i:${port} -t`).toString();
      return output.length > 0;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Find a free port starting from the given port
 * @param {number} startPort - The port to start checking from
 * @returns {number} A free port
 */
function findFreePort(startPort) {
  let port = startPort;
  while (isPortInUse(port)) {
    port++;
  }
  return port;
}

/**
 * Create a directory if it doesn't exist
 * @param {string} dirPath - The path to the directory
 * @returns {boolean} True if the directory was created or already exists, false otherwise
 */
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    return false;
  }
}

/**
 * Read a JSON file
 * @param {string} filePath - The path to the JSON file
 * @returns {Object|null} The parsed JSON object, or null if the file doesn't exist or is invalid
 */
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

/**
 * Write a JSON file
 * @param {string} filePath - The path to the JSON file
 * @param {Object} data - The data to write
 * @returns {boolean} True if the file was written successfully, false otherwise
 */
function writeJsonFile(filePath, data) {
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content);
    console.log(`Wrote JSON file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    return false;
  }
}

/**
 * Get the current timestamp in ISO format
 * @returns {string} The current timestamp
 */
function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} The formatted date
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a time as HH:MM:SS
 * @param {Date} date - The date to format
 * @returns {string} The formatted time
 */
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

module.exports = {
  isCommandAvailable,
  getCommandPath,
  isPortInUse,
  findFreePort,
  ensureDirectoryExists,
  readJsonFile,
  writeJsonFile,
  getCurrentTimestamp,
  formatDate,
  formatTime
};
