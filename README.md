# Trasabilitate-paine

## Project Configuration

This document describes where all project configuration files are defined and their purpose.

### Configuration File Locations

#### 1. **package.json**
- **Location:** `/package.json` (root directory)
- **Purpose:** Defines Node.js project metadata, dependencies, and npm scripts
- **Key configurations:**
  - Development dependencies (webpack, webpack-cli)
  - Project metadata (name, version, etc.)

#### 2. **package-lock.json**
- **Location:** `/package-lock.json` (root directory)
- **Purpose:** Locks exact versions of all dependencies for consistent installations
- **Auto-generated:** Yes, automatically updated when dependencies change

#### 3. **webpack.config.js**
- **Location:** `/webpack.config.js` (root directory)
- **Purpose:** Configures webpack bundler settings
- **Key configurations:**
  - Entry points
  - Output directory
  - Build mode

#### 4. **.vscode/launch.json**
- **Location:** `/.vscode/launch.json`
- **Purpose:** Defines VS Code debug configurations
- **Key configurations:**
  - Node.js debugging
  - Chrome debugging
  - NPM script launching

#### 5. **.gitignore**
- **Location:** `/.gitignore` (root directory)
- **Purpose:** Specifies files and directories that Git should ignore
- **Excluded items:**
  - node_modules/
  - Build artifacts (dist/)
  - IDE-specific files

### Quick Reference

| Configuration | File | Location |
|--------------|------|----------|
| Node.js Project | package.json | Root |
| Dependencies Lock | package-lock.json | Root |
| Webpack Bundler | webpack.config.js | Root |
| VS Code Debugging | launch.json | .vscode/ |
| Git Ignore Rules | .gitignore | Root |