//depndencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const { first, last } = require('rxjs');
require('console.table');

//mysql connection
const connection = mysql.createConnection({
    host: 'localhost',

    port: 3001,

    user: 'root',
    password: 'Password_here',
    database: 'employeeDB'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`)
    firstPrompt();
});

//prompts the user what action they should take
function firstPrompt() {
    inquirer.prompt({
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: [
            "View Employees",
            "View Employees - by Department",
            "Add an Employee",
            "Remove Employee",
            "Update Employee role",
            "Add Role",
            "End"
        ]
    })
    .then(function ({ task }) {
        switch (task) {
            case "View Employees":
                viewEmployee();
                break;
            case "View Employees - by Department":
                viewEmployeeByDepartment();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee role":
                UpdateEmployeeRole();
                break;
            case "Add Role":
                addRole();
                break;
            case "End":
                connection.end();
                break;
        }
    });
}

//view employees
function viewEmployee() {
    console.log("Viewing employees\n");

    var query = 
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r
        ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        LEFT JOIN employee m
        ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("Employees viewed\n");

        firstPrompt();
    });
}

//view employees by department
function viewEmployeeByDepartment() {
    console.log("Viewing employees by department\n");

    var query = 
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r
        ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        LEFT JOIN employee m
        ON m.id = e.manager_id`

        connection.query(query, function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("Employee by Department\n");

            promptDepartment(departmentChoices);
    });
}

// user chooses department list
function promptDepartment(departmentChoices) {
    inquirer.prompt([
        {
            tyoe: "list",
            name: "departmentId",
            message: "Which department would you like to choose?",
            choices: departmentChoices
        }
    ]).then(function (answer) {
        console.log("answer ", answer.departmentId);

        var query =
            `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
            FROM employee e
            JOIN role r
                ON e.role_id = r.id
            JOIN department d
            ON d.id = r.department_id
            WHERE d.id = ?`
        
            connection.query(query, answer.departmentId, function (err, res) {
                if (err) throw err;

                console.table("response ", res);
                console.log(res.affectedRows + "Employees have been viewed\n")

                firstPrompt();
            });
    });
}

// Employee array
function addEmployee() {
    console.log("creating an employee")

    var query =
        `SELECT r.id r.title r.salary
        FROM role r`
    connection.query(query, function (err, res) {
        if (err) throw err;
        const roleChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log("RoleToInsert");

        promptInsert(roleChoices);
    });
}

function promptInsert(roleChoices) {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the employee?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the employee?"
        },
        {
            type: "input",
            name: "roleId",
            message: "What is the role of the employee?",
            choices: roleChoices
        },
    ]).then(function (answer) {
        console.log(answer);

        var query = `INSERT INTO employee SET?`
        connection.query(query, 
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.roleId,
                manager_id: answer.managerId,
            },
            function (err, res) {
                if (err) throw err;

                console.table(res);
                console.log(res.inswertRows + "inswerted successfully\n");

                firstPrompt();
        });
    })
}

//remove employees
function removeEmployees() {
    console.log("Deleting an employee");
    
    var query =
    `SELECT e.id, e.first_name, e.last_name
    FROM employee e`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("ArrayToDelete/n");

        promptDelete(deleteEmployeeChoices);
    });
}

// user chooses employee list, then employee is deleted
function promptDelete(deleteEmployeeChoices) {
    inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want removed?",
            choices: deleteEmployeeChoices
        }
    ]).then(function (answer) {
        var query = `DELETE FROM employee WHERE ?`;
        connection.query(query, { id: answer.employeeId }, function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log(res.affectedRows + "Deleted\n");

            firstPrompt();
        });
    });
}

//Update Employee's role
function UpdateEmployeeRole() {
    employeeArray();
}

function employeeArray() {
    console.log("Updating employee");

    var query = 
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary,
    CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
    ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;
        
        const employeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("employeeArray to Update\n")

        roleArray(employeeChoices);
    });
}

function roleArray(employeeChoices) {
    console.log("Updating role");

    var query = 
    `SELECT r.id, r.title, r.salary
    FROM role r`
    let roleChoices;

    connection.query(query, function (err, res) {
        if (err) throw err;

        roleChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log("roleArray to Update\n")

        promptEmployeeRole(employeeChoices, roleChoices);
    });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

    inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to have the role?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "roleId",
            message: "Which role do you want updated?",
            choices: roleChoices
        },
    ]).then(function (answer) {
        var query = `UPDATE employee SET role_id = ? WHERE id = ?`
        connection.query(query,
            [answer.roleId,
            answer.employeeId],
            function (err, res) {
                if (err) throw err;
                
                console.table(res);
                console.log(res.affectedRows + "Updated successfully");

                firstPrompt();
            });
    });
}

// add role
function addRole() {
    var query =
        `SELECT d.id, d.name, r.salary AS budget
        FROM employee e
        JOIN role r
        ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        GROUP BY d.id, d.name`
    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(({ id, name }) => ({
            value: id, name: `${id} ${name}`
        }));

        console.table(res);
        console.log("Department array");

        promptAddRole(departmentChoices);
    });
}

function promptAddRole(departmentChoices) {
    inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "Role Title"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "Role Salary"
        },
        {
            type: "input",
            name: "departmentId",
            message: "Department",
            choices: departmentChoices
        },
    ]).then(function (answer) {

        var query = `INSERT INTO role SET ?`

        connection.query(query, {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        },
        function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log("Role Inserted");

            firstPrompt();
        });
    });
}