/**
 * Check Dependencies Script
 * 
 * This script checks if the required dependencies are installed and installs them if needed.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Check if a package is installed globally
 * @param {string} packageName - The name of the package to check
 * @returns {boolean} True if the package is installed, false otherwise
 */
function isPackageInstalledGlobally(packageName) {
  try {
    const output = execSync(`npm list -g ${packageName} --depth=0`).toString();
    return !output.includes('(empty)') && !output.includes('npm ERR!');
  } catch (error) {
    return false;
  }
}

/**
 * Install a package globally
 * @param {string} packageName - The name of the package to install
 * @returns {boolean} True if the installation was successful, false otherwise
 */
function installPackageGlobally(packageName) {
  try {
    console.log(`Installing ${packageName} globally...`);
    execSync(`npm install -g ${packageName}`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error installing ${packageName} globally:`, error.message);
    return false;
  }
}

/**
 * Check if npx is available
 * @returns {boolean} True if npx is available, false otherwise
 */
function isNpxAvailable() {
  try {
    execSync('npx --version');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the full path to the Node.js executable
 * @returns {string} The full path to the Node.js executable
 */
function getNodePath() {
  return process.execPath;
}

/**
 * Get the full path to the npx executable
 * @returns {string|null} The full path to the npx executable, or null if not found
 */
function getNpxPath() {
  const nodePath = getNodePath();
  const nodeDir = path.dirname(nodePath);
  const npxPath = path.join(nodeDir, process.platform === 'win32' ? 'npx.cmd' : 'npx');
  
  if (fs.existsSync(npxPath)) {
    return npxPath;
  }
  
  return null;
}

/**
 * Check and install required dependencies
 */
function checkAndInstallDependencies() {
  console.log('Checking dependencies...');
  
  // Check if npx is available
  if (!isNpxAvailable()) {
    console.error('npx is not available. Please install Node.js and npm.');
    process.exit(1);
  }
  
  // Get the full path to npx
  const npxPath = getNpxPath();
  if (!npxPath) {
    console.error('Could not find the npx executable.');
    process.exit(1);
  }
  
  console.log(`npx found at: ${npxPath}`);
  
  // Check if @smithery/cli is installed globally
  if (!isPackageInstalledGlobally('@smithery/cli')) {
    console.log('@smithery/cli is not installed globally. Installing...');
    if (!installPackageGlobally('@smithery/cli')) {
      console.error('Failed to install @smithery/cli globally.');
      process.exit(1);
    }
  } else {
    console.log('@smithery/cli is already installed globally.');
  }
  
  // Check if @benborla29/mcp-server-mysql is installed globally
  if (!isPackageInstalledGlobally('@benborla29/mcp-server-mysql')) {
    console.log('@benborla29/mcp-server-mysql is not installed globally. Installing...');
    if (!installPackageGlobally('@benborla29/mcp-server-mysql')) {
      console.error('Failed to install @benborla29/mcp-server-mysql globally.');
      process.exit(1);
    }
  } else {
    console.log('@benborla29/mcp-server-mysql is already installed globally.');
  }
  
  console.log('All dependencies are installed.');
}

// If this script is run directly (not imported), check and install dependencies
if (require.main === module) {
  checkAndInstallDependencies();
}

// Export functions for use in other scripts
module.exports = {
  isPackageInstalledGlobally,
  installPackageGlobally,
  isNpxAvailable,
  getNodePath,
  getNpxPath,
  checkAndInstallDependencies
};
