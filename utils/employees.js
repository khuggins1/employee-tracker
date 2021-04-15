const cTable = require('console.table');

const con = require('../db/database');

const displayMany = require('../utils/displayMenu')

//new employee
const addEmployee = (firstName, lastName, roleId, managerId) => {
    console.log('name:', name, 'salary', sal, 'department_id', depId);
    con.promise().query(
        `INSERT INTO employees SET ?`,
        {
            first_name: firstName,
            last_name: lastName,
            manager_id: managerId,
            role_id: roleId
        },
    )
    .then(([rows, fields]) => {
        console.log('new employee added')
        console.log(rows);
    })
 .catch(error => {
     if (error) {
         console.log(error)
     }
 })  
 .then( () => displayMany());

};
const updateRole = (employeeId, roleId) => {
    con.promise().query(
        `UPDATE employees SET ? WHERE employees.id = ?`,
        [{ role_id: roleId }, employeeId]

    )
    .then (([rows]) => {
        console.log('employee updated')
        console.log(rows);
    })
    .catch(error => {
        if (error) {
            console.log(error)
        }
    })
    .then( () => displayMany());
};

const getAllEmployees = () => {
    con.promise().query(
        `SELECT e.id, e.first_name, e.last_name, title AS Job_Title, salary, name AS Department_Name,
        IFNULL (CONCAT(m.first_name, ',', m.last_name), 'NULL') AS 'Manager'
        FROM employees e
        LEFT JOIN employees m ON e.manager_id = m.id
        LEFT JOIN roles ON e.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        ORDER BY e.id ASC;`)
        .then (([rows, fields]) => {
            console.log('Employees......')
            console.log.table(rows);
        })
        .catch(error => {
            if (error) {
                console.log(error)
            }
        })
        .then ( () => displayMany());
    
};


module.exports = { getAllEmployees, addEmployee, updateRole };