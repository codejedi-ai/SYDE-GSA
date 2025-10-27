/*
  # Create memories table for term-based event memories

  1. New Tables
    - `memories`
      - `id` (uuid, primary key) - Unique identifier for each memory
      - `title` (text) - Title of the memory/event
      - `description` (text) - Detailed description of what happened
      - `term` (text) - Academic term (e.g., "Fall 2024", "Winter 2025")
      - `date` (date) - When the event occurred
      - `image_url` (text, nullable) - Optional image for the memory
      - `created_at` (timestamptz) - When the memory was added
      
  2. Security
    - Enable RLS on `memories` table
    - Add policy for public read access (memories are public)
    - Add policy for authenticated users to insert memories
*/

CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  term text NOT NULL,
  date date NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view memories"
  ON memories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert memories"
  ON memories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update memories"
  ON memories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete memories"
  ON memories
  FOR DELETE
  TO authenticated
  USING (true);
