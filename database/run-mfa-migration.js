/**
 * MFA Migration Helper Script
 * 
 * This script helps run the migration to set up the MFA table and functionality
 * for the WealthWise application.
 * 
 * Usage:
 * 1. Make sure you have configured your Supabase credentials in the .env file
 * 2. Run this script with: node database/run-mfa-migration.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Migration file path
const MIGRATION_FILE = path.join(__dirname, 'migrations', '002_create_mfa_table.sql');

// Check if .env file exists
const checkEnvFile = () => {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found. Please create one with your Supabase credentials.');
    console.log('Example .env file:');
    console.log('VITE_SUPABASE_URL=your_supabase_url');
    console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
    process.exit(1);
  }
  return true;
};

// Check if migration file exists
const checkMigrationFile = () => {
  if (!fs.existsSync(MIGRATION_FILE)) {
    console.error(`Error: Migration file not found at ${MIGRATION_FILE}`);
    process.exit(1);
  }
  return true;
};

// Run migration
const runMigration = () => {
  try {
    // Run the migration using supabase CLI if installed
    try {
      console.log('Attempting to run migration with Supabase CLI...');
      execSync('npx supabase migration up', { stdio: 'inherit' });
      return true;
    } catch (err) {
      console.log('Supabase CLI not installed or failed. Falling back to manual instructions.');
      
      // If supabase CLI isn't available, provide manual instructions
      console.log('\nManual Migration Instructions:');
      console.log('------------------------------');
      console.log('1. Log in to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Create a new query and paste the following SQL:');
      console.log('\n' + fs.readFileSync(MIGRATION_FILE, 'utf8'));
      console.log('\n4. Run the query to create the MFA table and set up RLS policies');
      
      return false;
    }
  } catch (error) {
    console.error('Error running migration:', error.message);
    return false;
  }
};

// Main function
const main = async () => {
  console.log('WealthWise MFA Migration Helper');
  console.log('==============================\n');
  
  // Check prerequisites
  if (!checkEnvFile() || !checkMigrationFile()) {
    return;
  }
  
  // Ask for confirmation
  rl.question('This will set up the MFA functionality for WealthWise. Continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Migration cancelled.');
      rl.close();
      return;
    }
    
    console.log('\nRunning MFA migration...\n');
    const success = runMigration();
    
    if (success) {
      console.log('\n✅ MFA migration completed successfully!');
      console.log('You can now use multi-factor authentication in your application.');
    } else {
      console.log('\n⚠️  Please follow the manual instructions above to complete the setup.');
    }
    
    rl.close();
  });
};

// Run the script
main(); 