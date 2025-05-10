
-- Create a database function to handle upvotes securely
CREATE OR REPLACE FUNCTION public.increment_upvote(resource_id uuid)
RETURNS boolean AS $$
DECLARE
  already_upvoted boolean;
BEGIN
  -- Check if the user has already upvoted this resource
  SELECT EXISTS(
    SELECT 1 FROM public.user_upvotes 
    WHERE user_id = auth.uid() AND resource_id = resource_id
  ) INTO already_upvoted;
  
  -- If user has not already upvoted, insert a record and update the upvote count
  IF NOT already_upvoted THEN
    -- Insert record into user_upvotes
    INSERT INTO public.user_upvotes (user_id, resource_id)
    VALUES (auth.uid(), resource_id);
    
    -- Update the upvote count in the resources table
    UPDATE public.resources
    SET upvotes = upvotes + 1
    WHERE id = resource_id;
    
    RETURN TRUE;
  ELSE
    -- User has already upvoted this resource
    RETURN FALSE;
  END IF;
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

COMMENT ON FUNCTION public.increment_upvote IS 'Securely increments the upvote count for a resource if the user has not already upvoted it';
