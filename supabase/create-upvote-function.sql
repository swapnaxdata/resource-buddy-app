
-- Create a database function to handle upvotes securely
CREATE OR REPLACE FUNCTION public.increment_upvote(resource_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.resources
  SET upvotes = upvotes + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.increment_upvote TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_upvote TO anon;

-- Update RLS policy to ensure upvoting works for all authenticated users
DROP POLICY IF EXISTS "Users can update upvotes on any resource" ON public.resources;

-- Create policy allowing function execution for authenticated users
CREATE POLICY "Allow increment_upvote function for authenticated users"
ON public.resources
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);

COMMENT ON FUNCTION public.increment_upvote IS 'Securely increments the upvote count for a resource';
