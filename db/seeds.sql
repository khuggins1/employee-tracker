INSERT INTO departments (name)
VALUES
('Sales'),

('Engineering'),

('Finance'),

('Legal');

INSERT INTO roles(title, salary, department_id)
VALUES
('Sales Lead Team', 2000, 4),
('Salesperson', 4000, 2),
('Lead Engineer', 80000, 3),
 ('Accountant',6000,4),
 ('Bookeeper',20000,1),
 ('Lawyer',80000, 2),
 ('Legal Team Lead',50000,1);

 INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES 
  ('Becky', 'Cage', NULL, 1),
  ('Mark', 'Force', 1, 2),
  ('Michael', 'Scott', NULL, 4),
  ('Scott', 'Pilgram', 3, 3),
  ('Melissa', 'Mccarthy', 3, 3),
  ('Brad', 'Pitt', NULL, 5),
  ('Henry', 'Ford', 6, 6),
  ('Michael', 'Jackson', 6, 6),
  ('Thomas', 'Hill', 10, 7),
  ('Ned', 'Sanders', NULL, 8),
  ('Owen', 'Wilson', 10, 7),
  ('Karl', 'Malone', 3, 3),
  ('Kobe', 'Bryant', 3, 3); 