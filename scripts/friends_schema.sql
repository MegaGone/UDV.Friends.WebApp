CREATE TABLE IF NOT EXISTS my_friends (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  gender VARCHAR(10)
);

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
