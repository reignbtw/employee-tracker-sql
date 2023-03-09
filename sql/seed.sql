USE employeeDB;

INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Naruto", "Uzumaki", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sasuke", "Uchiha", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Itachi", "Uchiha", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gojo", "Satoru", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tanjiro", "Kamado", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Nezuko", "Kamado", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kakashi", "Hatake", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Levi", "Ackerman", 1, 3);