CREATE TABLE IF NOT EXISTS my_friends (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  gender VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FUNCTION: Update 'updated_at' column before update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- DROP TRIGGER IF EXISTS (safe way)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at'
      AND tgrelid = 'my_friends'::regclass
  ) THEN
    DROP TRIGGER set_updated_at ON my_friends;
  END IF;
END;
$$;

-- CREATE TRIGGER: runs before each update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON my_friends
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- INSERT DUMMY DATA
INSERT INTO my_friends (name, gender)
VALUES
  ('Rodrigo', 'Male'),
  ('Rigoberto', 'Male'),
  ('Ana', 'Female'),
  ('Javier', 'Male'),
  ('Moises', 'Male'),
  ('Camila', 'Female'),
  ('Federico', 'Male'),
  ('Arturo', 'Male'),
  ('Maria', 'Female'),
  ('Santiago', 'Male'),
  ('Ghary', 'Male'),
  ('Sofia', 'Female')
ON CONFLICT DO NOTHING;
