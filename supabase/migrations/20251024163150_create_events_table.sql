/*
  # Create Events Table for SYDE GSA

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, event title)
      - `description` (text, event description)
      - `event_date` (date, when the event occurs)
      - `event_time` (text, time of the event)
      - `location` (text, event location)
      - `attendees_expected` (text, expected number of attendees)
      - `image_url` (text, optional event image)
      - `is_featured` (boolean, whether event is featured)
      - `is_past` (boolean, whether event has occurred)
      - `created_at` (timestamptz, when record was created)
      - `updated_at` (timestamptz, when record was last updated)
  
  2. Security
    - Enable RLS on `events` table
    - Add policy for public read access (anyone can view events)
    - Add policy for authenticated admin users to create/update events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date date NOT NULL,
  event_time text NOT NULL,
  location text NOT NULL,
  attendees_expected text DEFAULT '0',
  image_url text,
  is_featured boolean DEFAULT false,
  is_past boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO events (title, description, event_date, event_time, location, attendees_expected, is_featured, is_past) VALUES
('Halloween Event', 'Join us for a spooky Halloween celebration! Costume contest, games, treats, and networking with fellow SYDE grad students.', '2025-10-31', '6:00 PM - 10:00 PM', 'E7 Common Area', '50+ expected', true, false),
('Welcome Back Social', 'Welcomed new and returning SYDE grad students for the Fall 2025 term.', '2025-09-15', '5:00 PM - 8:00 PM', 'Graduate House', '40', false, true);
