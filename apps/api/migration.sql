CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50),
  body VARCHAR(250),
  created_at timestamp DEFAULT NOW()
);

INSERT INTO entries (title, body) VALUES ('Morning Routine', 'Start your day with a positive routine. It helps you stay productive.');
INSERT INTO entries (title, body) VALUES
('Healthy Habits', 'Small daily habits lead to long-term health improvements. Start today!'),
('Work-Life Balance', 'Find harmony between your work and personal life for better health.');

ALTER TABLE entries ALTER COLUMN body TYPE VARCHAR(600)
ALTER TABLE entries ALTER COLUMN title TYPE VARCHAR(100)