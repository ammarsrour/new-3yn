/*
  # Enhance Audit System

  ## Overview
  This migration enhances the existing activity tracking system to create a comprehensive
  audit system that tracks: who logged in, what they did, what they uploaded, and what they downloaded.

  ## Changes

  ### 1. Enhance user_activities table
  - Add session_id column for correlating activities within a login session
  - Add result_status column for tracking success/failure of operations
  - Update activity_type constraint to include new types (signup, analysis_complete, analysis_failed)

  ### 2. Enhance user_files table
  - Add file_url column for storing public URLs of files
  - Add storage_path column for storing Supabase storage paths

  ### 3. New indexes for admin queries
  - Composite index for user + time range queries
  - Activity type + time index for filtering
  - File activities composite index

  ### 4. New admin_audit_log table
  - Tracks admin actions (view dashboard, export CSV, bulk download, etc.)
  - Only admins can view and insert records
*/

-- =====================================================
-- ENHANCE user_activities TABLE
-- =====================================================

-- Add session_id to correlate activities within a login session
ALTER TABLE user_activities
  ADD COLUMN IF NOT EXISTS session_id uuid;

-- Add result_status for tracking success/failure
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_activities' AND column_name = 'result_status'
  ) THEN
    ALTER TABLE user_activities ADD COLUMN result_status text
      CHECK (result_status IN ('success', 'failure', 'pending', 'cancelled'));
  END IF;
END $$;

-- Update activity_type constraint to include new types
-- First drop the existing constraint, then add the new one
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'user_activities' AND constraint_name = 'user_activities_activity_type_check'
  ) THEN
    ALTER TABLE user_activities DROP CONSTRAINT user_activities_activity_type_check;
  END IF;

  -- Add new constraint with all activity types
  ALTER TABLE user_activities
    ADD CONSTRAINT user_activities_activity_type_check
    CHECK (activity_type IN (
      'page_view', 'upload', 'analysis', 'analysis_complete', 'analysis_failed',
      'download', 'login', 'logout', 'signup', 'location_select'
    ));
EXCEPTION
  WHEN duplicate_object THEN
    -- Constraint already exists with correct definition, ignore
    NULL;
END $$;

-- =====================================================
-- ENHANCE user_files TABLE
-- =====================================================

-- Add file_url for storing public URLs (for download tracking)
ALTER TABLE user_files
  ADD COLUMN IF NOT EXISTS file_url text;

-- Add storage_path for storing Supabase storage paths
ALTER TABLE user_files
  ADD COLUMN IF NOT EXISTS storage_path text;

-- =====================================================
-- NEW INDEXES FOR ADMIN QUERIES
-- =====================================================

-- Composite index for user + time range queries (common admin query pattern)
CREATE INDEX IF NOT EXISTS idx_user_activities_user_time
  ON user_activities(user_id, created_at DESC);

-- Index for activity type filtering with time (for filtering by type in admin)
CREATE INDEX IF NOT EXISTS idx_user_activities_type_time
  ON user_activities(activity_type, created_at DESC);

-- Composite index for file activities (admin file tracking)
CREATE INDEX IF NOT EXISTS idx_user_files_user_action_time
  ON user_files(user_id, action, created_at DESC);

-- =====================================================
-- ADMIN AUDIT LOG TABLE (NEW)
-- =====================================================

-- Create table to track admin actions for compliance and auditing
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL CHECK (action_type IN (
    'view_dashboard', 'view_activities', 'export_csv',
    'bulk_download', 'filter_user', 'view_user_detail'
  )),
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_audit_log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin audit log
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_log' AND policyname = 'Admins can view admin audit log'
  ) THEN
    CREATE POLICY "Admins can view admin audit log"
      ON admin_audit_log FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Only admins can insert into admin audit log
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_log' AND policyname = 'Admins can insert admin audit'
  ) THEN
    CREATE POLICY "Admins can insert admin audit"
      ON admin_audit_log FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Indexes for admin audit queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_time
  ON admin_audit_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_admin
  ON admin_audit_log(admin_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_action
  ON admin_audit_log(action_type);
