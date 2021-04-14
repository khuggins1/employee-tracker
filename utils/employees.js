const cTable = require('console.table');

const con = require('../db/database');

const displayMany = () => {
    con.end()
};

//new employee
const addEmployee = (name, sal, depId) => {
    console.log('name:', name, 'salary', sal, 'department_id', depId);
    con.promise().query(
        `INSERT INTO roles SET ?`,
        {
            title: name,
            salary: sal,
            department_id: depId
        },
    )
    .then(([rows, fields]) => {
        console.log('new role added')
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


module.exports = { getAllEmployees, addEmployee };