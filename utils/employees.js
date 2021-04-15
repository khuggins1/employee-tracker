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

const displayAllEmployees = (view) => {
    let param = '';
    if(view === 1) {
        parma = `SELECT e.id, e.first_name, e.last_name, title AS Job_Title, salary, name AS Department_Name,
        IFNULL (CONCAT(m.first_name, ',', m.last_name), 'NULL') AS 'Manager'
        FROM employees e
        LEFT JOIN employees m ON e.manager_id = m.id
        LEFT JOIN roles ON e.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        ORDER BY e.id ASC;`

    } else if (view === 2){
        param = `SELECT e.id, e.first_name, e.last_name, title AS Job_Title, salary, name AS Department_Name, 
        IFNULL(CONCAT(m.first_name, ', ', m.last_name),'NULL') AS 'Manager'
        FROM employees e
        LEFT JOIN employees m ON e.manager_id = m.id
        LEFT JOIN roles ON e.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        ORDER BY Manager;`
    //selected view by department
    } else if (view === 3){
        param = `SELECT e.id, e.first_name, e.last_name, title AS Job_Title, salary, name AS Department_Name, 
        IFNULL(CONCAT(m.first_name, ', ', m.last_name),'NULL') AS 'Manager'
        FROM employees e
        LEFT JOIN employees m ON e.manager_id = m.id
        LEFT JOIN roles ON e.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        ORDER BY name;`
    }

    return con.promise().query(param)
        .then(([rows, fields]) => {
            console.log('Employees......')
            console.table(rows);
        })
        .catch(error =>{
            if (error){
                console.log('error viewing all employees: ', error)
            }
        })
};
     

const getAllEmployees = () => {
    return con.promise(). query(
        `SELECT id , first_name, last_name
        FROM employees`)
};

//Update Employee's manager
const updateManager = (data)=>{

    // to get the Id from the employee string
    let getId = data.employee.split(".");
    let employeeId = parseInt(getId[0]);

    //define param depending on if manager's Id is NULL or not
    let param = [];
    if(data.manager !== 'None'){    
        // to get the Id from the manager string
        let splitId = data.manager.split(".");
        let managerId = parseInt(splitId[0]);
        param = [managerId, employeeId]
    } else if(data.manager === 'None'){
        param = [null, employeeId]
    }
    return con.promise().query(
        `UPDATE employees SET manager_id = ? WHERE employees.id = ?`,
        param
        )
        .then(([rows, fields]) => {
            console.log('employee updated')
            console.log(getId[1])
        })
        .catch(error =>{
            if (error){
                console.log(`error updating employee's manager: `, error)
            }
        }) 
};


const deleteEmployee = (data) => {

    let id = 0;

    let getId = data.employee.split(".");
    id = parseInt(getId[0]);
    return con.promise(). query (
        `DELETE FROM employees WHERE employees.id = ?`, id)
        .then (([rows, fields ]) => {
            console.log(`employee ${getId[1]} deleted`)
        })
        .catch(error => {
            if(error) {
                console.log(`error deleting employee:`, error)
            }
        })
}

module.exports = { addEmployee, displayAllEmployees, getAllEmployees, updateRole, updateManager, deleteEmployee };