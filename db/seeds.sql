use employee_tracker;

INSERT INTO departments (name)
VALUES
('Sales'),

('Engineering'),

('Finance'),

('Legal');

INSERT INTO roles(title, salary, department_id)
VALUES
 ('Sales Lead Team', 100000,1),
 ('Salesperson', 80000,1),
 ('Sofware Engineer', 120000, 2), 
 ('Lead Engineer', 130000, 2),
 ('Accountant',125000,3),
 ('Bookeeper',100000,3),

 INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES 
  ('Anthony', 'Trollope',1, 1),
  ('Charlotte', 'Yonge', 2, 2),
  ('Horace', 'Walpole', 3, 3),
  ('Matthew', 'Lewis', 4, 4),
  ('William', 'Bedford', 5, 5),
  ('Anne', 'Radcliffe', 6,6),
  ('Charles', 'Brown', 7, 7),
 