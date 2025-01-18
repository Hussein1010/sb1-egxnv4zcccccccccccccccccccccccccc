/*
  # Initial Schema Setup for Game Progress

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - يتم ربطه مع معرف المستخدم من نظام المصادقة
      - `balance` (integer) - رصيد المستخدم من العملات
      - `clicks` (integer) - عدد النقرات المتبقية
      - `created_at` (timestamp) - تاريخ إنشاء الحساب
      - `last_click_reset` (timestamp) - آخر مرة تم فيها تجديد النقرات

    - `completed_tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - معرف المستخدم
      - `task_id` (integer) - معرف المهمة
      - `completed_at` (timestamp) - تاريخ إكمال المهمة

    - `invited_friends`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - معرف المستخدم الذي قام بالدعوة
      - `friend_name` (text) - اسم الصديق
      - `invite_code` (text) - رمز الدعوة
      - `created_at` (timestamp) - تاريخ الدعوة

  2. Security
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان للقراءة والكتابة
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  balance integer DEFAULT 0,
  clicks integer DEFAULT 1000,
  created_at timestamptz DEFAULT now(),
  last_click_reset timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create completed_tasks table
CREATE TABLE IF NOT EXISTS completed_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  task_id integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE completed_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own completed tasks"
  ON completed_tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed tasks"
  ON completed_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create invited_friends table
CREATE TABLE IF NOT EXISTS invited_friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  friend_name text NOT NULL,
  invite_code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invited_friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own invited friends"
  ON invited_friends
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invited friends"
  ON invited_friends
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);