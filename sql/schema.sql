DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

use employeeDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT, 
    title VARCHAR(45) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(45) NULL,
    last_name VARCHAR(45) NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);