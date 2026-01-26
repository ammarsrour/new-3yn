/*
  # Add Activity Tracking and Admin System

  ## Overview
  This migration adds comprehensive activity tracking and admin capabilities to the billboard analysis platform.

  ## 1. New Tables
  
  ### user_activities
  Tracks all user actions throughout the platform:
  - `id` (uuid, primary key) - Unique identifier for each activity
  - `user_id` (uuid, foreign key) - References auth.users
  - `activity_type` (text) - Type of activity (page_view, upload, analysis, download, login, logout)
  - `activity_description` (text) - Human-readable description
  - `metadata` (jsonb) - Additional data (file info, location, etc.)
  - `user_agent` (text) - Browser/device information
  - `ip_address` (text) - User's IP address
  - `created_at` (timestamptz) - When the activity occurred

  ### user_files
  Tracks file uploads and downloads:
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `file_name` (text) - Original filename
  - `file_type` (text) - MIME type
  - `file_size` (bigint) - Size in bytes
  - `action` (text) - 'upload' or 'download'
  - `metadata` (jsonb) - Additional file information
  - `created_at` (timestamptz) - When the file action occurred

  ## 2. Schema Changes
  
  ### user_profiles
  - Add `role` column (text, default 'user') - Can be 'user' or 'admin'

  ## 3. Security
  - Enable RLS on all new tables
  - Users can view only their own activities
  - Admins can view all activities
  - Users can insert their own activities
  - Only authenticated users can access these tables

  ## 4. Indexes
  - Create indexes for common query patterns
  - Speed up filtering by user_id, activity_type, and created_at
*/

-- Add role column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('page_view', 'upload', 'analysis', 'download', 'login', 'logout', 'location_select')),
  activity_description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create user_files table
CREATE TABLE IF NOT EXISTS user_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  action text NOT NULL CHECK (action IN ('upload', 'download')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_files_user_id ON user_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_created_at ON user_files(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activities

-- Users can view their own activities
CREATE POLICY "Users can view own activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all activities
CREATE POLICY "Admins can view all activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Users can insert their own activities
CREATE POLICY "Users can insert own activities"
  ON user_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_files

-- Users can view their own files
CREATE POLICY "Users can view own files"
  ON user_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all files
CREATE POLICY "Admins can view all files"
  ON user_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Users can insert their own file records
CREATE POLICY "Users can insert own files"
  ON user_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create a helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;