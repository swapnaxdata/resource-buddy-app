
-- This is an SQL script to set up the admin user and RLS policies for StudyBuddy

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT (role = 'admin')
  INTO is_admin
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Resources Table Policies for Admin Users

-- Policy to allow admins to select any resource
CREATE POLICY "Admins can view all resources"
ON resources
FOR SELECT
USING (public.is_admin());

-- Policy to allow admins to insert any resource
CREATE POLICY "Admins can insert any resource"
ON resources
FOR INSERT
WITH CHECK (public.is_admin());

-- Policy to allow admins to update any resource
CREATE POLICY "Admins can update any resource"
ON resources
FOR UPDATE
USING (public.is_admin());

-- Policy to allow admins to delete any resource
CREATE POLICY "Admins can delete any resource"
ON resources
FOR DELETE
USING (public.is_admin());

-- Policy to allow regular users to view all resources
CREATE POLICY "Anyone can view resources"
ON resources
FOR SELECT
USING (true);

-- Policy to allow users to create their own resources
CREATE POLICY "Users can create their own resources"
ON resources
FOR INSERT
WITH CHECK (auth.email() = user_email);

-- Policy to allow users to update their own resources
CREATE POLICY "Users can update their own resources"
ON resources
FOR UPDATE
USING (auth.email() = user_email);

-- Policy to allow users to delete their own resources
CREATE POLICY "Users can delete their own resources"
ON resources
FOR DELETE
USING (auth.email() = user_email);

-- Enable Row-Level Security on resources table
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create the default admin user (if not exists)
-- Note: You should create this user through the application UI first, then run this update
-- to set the role to 'admin'
DO $$
BEGIN
  UPDATE profiles
  SET role = 'admin'
  WHERE email = 'admin@studybuddy.com';
END $$;

-- Add a comment to remind users to create the admin user first
COMMENT ON FUNCTION public.is_admin() IS 'Function to check if the current user is an admin';
