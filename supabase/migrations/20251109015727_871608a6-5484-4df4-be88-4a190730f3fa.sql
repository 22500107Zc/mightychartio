-- Allow admins/founders to delete any feedback
DROP POLICY IF EXISTS "Admins can delete any feedback" ON public.feedback;
CREATE POLICY "Admins can delete any feedback"
ON public.feedback
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Function to validate display names (prevent restricted titles)
CREATE OR REPLACE FUNCTION public.validate_display_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if display name contains restricted words (case insensitive)
  IF NEW.display_name ~* '(founder|ceo|cto|cfo|president|owner|director|manager|admin|moderator|staff|team|official)' THEN
    -- Allow if user has admin role
    IF NOT has_role(NEW.user_id, 'admin') THEN
      RAISE EXCEPTION 'Display name cannot contain restricted titles like Founder, CEO, etc.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for profiles table
DROP TRIGGER IF EXISTS validate_profile_display_name ON public.profiles;
CREATE TRIGGER validate_profile_display_name
BEFORE INSERT OR UPDATE OF display_name ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.validate_display_name();

-- Create trigger for feedback table
DROP TRIGGER IF EXISTS validate_feedback_display_name ON public.feedback;
CREATE TRIGGER validate_feedback_display_name
BEFORE INSERT OR UPDATE OF display_name ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.validate_display_name();