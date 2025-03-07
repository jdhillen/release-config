#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function createReleaseConfig() {
  const releaseConfigPath = join(process.cwd(), 'release.config.js');

  if (existsSync(releaseConfigPath)) {
    console.log('ℹ️ release.config.js already exists');
    return;
  }

  const releaseConfig = `export default {
  extends: '@jdhillen/release-config'
};`;

  console.log('📝 Creating release.config.js...');
  await writeFile(releaseConfigPath, releaseConfig, 'utf8');
}

async function addCommitizenConfig() {
  try {
    const packagePath = join(process.cwd(), 'package.json');
    const packageContent = await readFile(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    let modified = false;

    packageJson.scripts = packageJson.scripts || {};

    if (!packageJson.scripts.commit) {
      console.log('📝 Adding commit script...');
      packageJson.scripts.commit = "cz";
      modified = true;
    } else {
      console.log('ℹ️ Commit script already exists');
    }

    if (!packageJson.scripts['semantic-release']) {
      console.log('📝 Adding semantic-release script...');
      packageJson.scripts['semantic-release'] = "semantic-release";
      modified = true;
    } else {
      console.log('ℹ️ Semantic-release script already exists');
    }

    if (!packageJson.config?.commitizen?.path) {
      console.log('📝 Adding Commitizen configuration...');
      packageJson.config = {
        ...packageJson.config,
        commitizen: {
          path: "./node_modules/cz-conventional-changelog"
        }
      };
      modified = true;
    } else {
      console.log('ℹ️ Commitizen configuration already exists');
    }

    if (modified) {
      await writeFile(
        packagePath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf8'
      );
      console.log('✅ Successfully updated package.json');
    } else {
      console.log('✨ No changes needed in package.json');
    }

    await createReleaseConfig();
    
    console.log('✅ Setup completed successfully');
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

addCommitizenConfig();