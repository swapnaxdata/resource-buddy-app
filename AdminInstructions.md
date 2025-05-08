
# StudyBuddy Admin Instructions

This document explains how to manage admin users in the StudyBuddy application.

## Default Admin User

The application is initialized with a default admin user:
- Email: admin@studybuddy.com
- Password: Admin123!

## Creating a New Admin User

### Method 1: Direct Database Update (Supabase Dashboard)

1. Go to the Supabase dashboard and select your project
2. Navigate to the "Table Editor" section
3. Select the "profiles" table
4. Find the user you want to promote to admin
5. Click on their row to edit it
6. Change the "role" field from "user" to "admin"
7. Save your changes

### Method 2: Using the Admin Dashboard

If you are already logged in as an admin user:

1. Navigate to the Admin Dashboard (/admin route)
2. Find the user you want to promote in the users list
3. Click on the "role toggle" button next to their name to change their role to admin

### Method 3: SQL Query (via Supabase SQL Editor)

Run the following SQL query in the Supabase SQL Editor, replacing `[USER_EMAIL]` with the email of the user you want to promote:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = '[USER_EMAIL]';
```

## Creating a New Admin User from Scratch

1. First, register a new user through the normal sign-up flow
2. Once the user is created, use one of the methods above to promote them to admin

## SQL to Create the Default Admin User

If you need to create the default admin user manually, run the following SQL in the Supabase SQL Editor:

```sql
-- First, create the user in the auth schema (this will be done by the application when you sign up)
-- Then, update the profile to have the admin role:

UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@studybuddy.com';

-- If the user doesn't exist yet, you'll need to first create a user through the application's 
-- sign-up process with the email admin@studybuddy.com and password Admin123!
-- The application will automatically create an entry in the profiles table.
```

## Row-Level Security (RLS) for Admin Users

The application includes RLS policies that allow admin users to perform operations on all resources, regardless of ownership. Here's how it works:

1. For each table with RLS policies, an admin check is included in the policy definition
2. Admin users can view, create, update, and delete any resource
3. Regular users can only perform operations on their own resources

## Troubleshooting

If you're experiencing issues with admin access:

1. Check that the user's role is correctly set to "admin" in the profiles table
2. Make sure the user is properly authenticated
3. Verify that the route protection in the application is functioning correctly
4. Check browser console logs for any errors related to authorization
