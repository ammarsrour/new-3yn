/*
  # User Profiles and Trial Management System

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `full_name` (text)
      - `company_name` (text)
      - `created_at` (timestamptz, default now())
      - `trial_start_date` (timestamptz, default now())
      - `trial_end_date` (timestamptz, default now() + 7 days)
      - `trial_credits_remaining` (integer, default 3)
      - `trial_credits_total` (integer, default 3)
      - `subscription_status` (text, default 'trial')
      - `subscription_tier` (text)
      - `last_analysis_at` (timestamptz)
  
  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read their own profile
    - Add policy for users to update their own profile
    - Add policy for authenticated users to insert their own profile
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  company_name text,
  created_at timestamptz DEFAULT now() NOT NULL,
  trial_start_date timestamptz DEFAULT now() NOT NULL,
  trial_end_date timestamptz DEFAULT (now() + interval '7 days') NOT NULL,
  trial_credits_remaining integer DEFAULT 3 NOT NULL,
  trial_credits_total integer DEFAULT 3 NOT NULL,
  subscription_status text DEFAULT 'trial' NOT NULL,
  subscription_tier text,
  last_analysis_at timestamptz
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);