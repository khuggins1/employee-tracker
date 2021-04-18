const cTable = require("console.table");
// require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql");
// const { query } = require('express');



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_track"
});

connection.connect(function(err) {
    if(err) throw err;
    options();
})

function options() {
    inquirer
    .prompt({
        name: 'action',
        type: 'list',
        message: 'Welcome to employee database! What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Deleting department',
            'Delete role',
            'Delete employee',
            'View total budget utilized by department',
            'Exit',
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case 'View all employees':
                displayEmployees();
                break;
            case 'View all departments':
                displayDepartments();
                break;
            case 'View all roles':
                displayRoles();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRoles();
                break;
            case 'Update employee role':
                updateRoles();
                break;
            case 'EXIT': 
                exitApp();
                break;
            default:
                break;
        }
})
};
//all employees

function displayEmployees() {
    var query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if(err) throw err;
        console.log(res.length + 'employees found!');
        console.table('All Employees:', res);
        options();
    })
};

function displayDepartments() {
    var query = 'SELECT * FROM department';
    connection.query(query, function(err, res) {
        if(err) throw err;
        console.table('All Departments:', res);
        options();
    })
};

function displayRoles() {
    var query = 'SELECT * FROM roles';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table('All Roles:', res)
        options();
    })
};

function addEmployee() {
    connection.query('SELECT * FROM roles', function (err, res) {
        if (err) throw err;
        inquirer
        .prompt ([
        {
            name: 'first_name',
            type: 'input',
            message: "What is the employee's first name?",
        },
        {
            name: 'last_name',
            type: 'input',
            message: "What is the employee's first name?",
        },
        {
            name: 'manager_id',
            type: 'input',
            message:"What is the employee's ID?"
        }, 
        { name: 'role',
        type: 'list',
        choices: function () {
                var roleArray = [];
                for (let i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title);
                }
                return roleArray;
            },
            message: "What is the employee's role?"
        }
    ]).then (function (answer) {
        let role_id;
        for (let a = 0; a < res.length; a++) {
            if (res[a].title == answer.role) {
                role_id = res[a].id;
                console.log(role_id)
            }
        }
        connection.query(
            'INSERT INTO employee SET ?',
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                manager_id: answer.manager_id,
                role_id: role_id,
            },
            function (err) {
                if (err) throw err;
                console.log('Congrats your employee added');
                options();
            })
    })
    })
};


function addDepartment() {
    inquirer
    .prompt([
        {
        name: 'newDepartment',
        type: 'input',
        message: 'which department would you like to add?'
        }
    ]).then (function (answer) {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: answer.newDepartment
            });
            var query = 'SELECT * FROM department';
            connection.query(query, function(err, res) {
                if(err) throw err;
                console.log('Your department has been added!');
                console.table('All Departments:', res);
                options();
            })
    })
    
};

function addRoles() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
        inquirer
        .prompt ([
            {
                name: 'new_role',
                type: 'input',
                message: "What role do you want to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role?'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArry = [];
                    for(let i = 0; i < res.length; i++) {
                        deptArry.push(res[i].name);
                    }
                    return deptArry;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for(let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department){
                    department_id = res[a].id;
                }
            }
            connection.query(
        'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function(err, res) {
                    if(err)throw err;
                    console.log('Your new role has been added!');
                    console.table('All Roles:', res);
                    options();
                })
        })
        })
    };

    //update roles



  function exitApp() {
      connection.end();
  };