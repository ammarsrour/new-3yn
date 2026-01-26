-- Setup Admin User Script
-- Run this SQL script to grant admin access to a user

-- STEP 1: Find your user ID
-- Replace 'your-email@example.com' with your actual email
SELECT id, email, full_name, role
FROM user_profiles
WHERE email = 'your-email@example.com';

-- STEP 2: Grant admin role to the user
-- Replace 'your-email@example.com' with your actual email
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- STEP 3: Verify the change
SELECT id, email, full_name, role
FROM user_profiles
WHERE role = 'admin';

-- OPTIONAL: Revoke admin access
-- UPDATE user_profiles
-- SET role = 'user'
-- WHERE email = 'your-email@example.com';
