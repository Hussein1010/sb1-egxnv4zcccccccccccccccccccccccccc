/*
  # Clear tables data

  This migration safely removes all data from tables while preserving their structure.

  1. Changes
    - Clears all data from invited_friends table
    - Clears all data from completed_tasks table
    - Clears all data from users table
  
  2. Notes
    - Uses TRUNCATE with CASCADE to handle dependencies
    - Preserves table structures and constraints
*/

-- Safely delete all data while preserving table structure
TRUNCATE TABLE invited_friends CASCADE;
TRUNCATE TABLE completed_tasks CASCADE;
TRUNCATE TABLE users CASCADE;