
-- Create a database function to check if a user has upvoted a resource
CREATE OR REPLACE FUNCTION public.check_user_upvote(resource_id uuid)
RETURNS boolean AS $$
DECLARE
  has_upvoted boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.user_upvotes 
    WHERE user_id = auth.uid() AND user_upvotes.resource_id = resource_id
  ) INTO has_upvoted;
  
  RETURN has_upvoted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.check_user_upvote TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_upvote TO anon;

COMMENT ON FUNCTION public.check_user_upvote IS 'Checks if the current user has upvoted a specific resource';
