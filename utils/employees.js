const cTable = require('console.table');

const con = require('../db/database');


//new employee
const addEmployee = (employee) => {
    console.log(employee)
    let getId = employee.role.split(".");
    let roleId = parseInt(getId);
    let getMId = employee.manager.split(".");
    let managerId= '';
    let data = {}
    if (getMId[0] !== 'NULL') {
        console.log(getMId, 'not NULL')
        managerId = parseInt(getMId);
        data = {
            first_name:employee.firstName,
            last_name:employee.lastName,
            manager_id: managerId,
            role_id: roleId
    
    }
} else if(getMId[0] === 'NULL') {
    console.log(getMId, `IS NULL`)
    data = {
        first_name: employee.firstName,
        last_name: employee.lastName,
        role_id: roleId
    }
}
    return con.promise().query(
        `INSERT INTO employees SET ?`,
        data,
    )
    
    .then(([rows, fields]) => {
        console.log('new employee added')
        console.log(data);
    })
 .catch(error => {
     if (error) {
         console.log('error adding new employee:', error)
     }
    })
      
}
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
            console.log( `error adding updating employee's role:`, error)
        }
    })
    .then( () => displayMany());
};

const displayAllEmployees = () => {
    return con.promise().query(
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
                console.log(`error viewing all employees`,error)
            }
        })
     
};

const getAllEmployees = () => {
    return con.promise(). query(
        `SELECT id , first_name, last_name
        FROM employees`)
}

module.exports = { addEmployee, displayAllEmployees, getAllEmployees, updateRole };