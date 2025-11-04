-- Add database-level validation for display names to prevent XSS
-- This constraint applies only when display_name is NOT NULL
-- Allows NULL values since not all users may have set a display name

ALTER TABLE profiles 
ADD CONSTRAINT display_name_format 
CHECK (
  display_name IS NULL OR 
  (display_name ~ '^[a-zA-Z0-9\s\-_$€£¥*+]{1,50}$' AND length(trim(display_name)) > 0)
);