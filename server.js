const cTable = require('console.table');
require('dotenv').config();
const inquirer = require('inquirer');
const db = require('./db/database');
const mysql = require('mysql')



const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});

connection.connect(function(err) {
    if(err) throw err;
    option();
})

const addDepartment = name => {
    return con.promise().query(
        'INSERT INTO departments SET ?',
        {
            name:name
        },
    )
   .then(([rows, fields]) => {
       console.log('department  added')
   })
    .catch(error => {
        if(error) {
            console.log(error)
        }
    })

};
function option () {
    inquirer
    .prompt({ 
        name: 'action',
        type: 'list',
        message: "Welcome to our employee database! What woudl you like to do",
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
    })
.then(function (answer) {
    switch (answer.action) {
        case 'View all employees':
            viewEmployees();
            break;
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Update employee role':
            updateRole();
            break;
        case 'EXIT': 
            exitApp();
            break;
        default:
            break;
    }
})

}




//all dep
const displayAllDepartments = () => {
    return con.promise().query ("SELECT * FROM departments")
    .then(([rows, fields]) => {
        console.log('\n\n Departments......');
        console.table(rows);
    })
    .catch(error => {
        if(error) {
            console.log('error connecting with database')
        }
    })

};

const getAllDepartments = () => {
    return con.promise().query("SELECT * FROM departments")
}

//delete department

const deleteDep = (data) => {
    let id = 0;

    let getId = data.addDepartment.split(".");
    id = parseInt(getId[0]);
    return con.promise().query(
        `DELETE FROM departments WHERE departments.id = ?`, id)
        .then(([ rows, fields]) => {
            console.log(`department ${getId[1]} deleted`)
        })
        .catch (error => {
            if(error) {
                console.log(`eror deleting department:`, error)
            }
        })
}


const viewBudget = () => {
    return con.promise().query(
        `SELECT name AS Department_name, SUM(salary) AS total  
        FROM employees
        LEFT JOIN roles ON role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        GROUP BY name;`)
        .then(([rows, fields]) => {
            console.log(`Total Budget utilized by deprtments`)
            console.table(rows)
        })
        .catch(error =>{
            if (error){
                console.log(`error viewing budget: `, error)
            }
        })
}

// function to display menu
let displayMenu =() => {
  return inquirer.prompt(MenuQuestions)
  .then((answers) => {
    if (answers.menuChoice === 'Exit'){
      con.end();
      console.log('BYE!')
      return;
    }else if (answers.menuChoice === 'View all departments') {
      console.log('\n');
      displayAllDepartments()
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    } else if (answers.menuChoice === 'View all roles') {
        console.log('\n');
        displayAllRoles()
        .then(() => {
          console.log('\n')
          displayMenu();
        })
    } else if (answers.menuChoice === 'View all employees') {
      console.log('\n');
      displayAllEmployees(1)
        .then(() => {
          console.log('\n');
          displayMenu();
        })
    } else if (answers.menuChoice === 'View all employees by manager') {
      console.log('\n');
      displayAllEmployees(2)
        .then(() => {
          console.log('\n');
          displayMenu();
        })
    } else if (answers.menuChoice === 'View all employees by department') {
      console.log('\n');
      displayAllEmployees(3)
        .then(() => {
          console.log('\n');
          displayMenu();
        })
    } else if (answers.menuChoice === 'Add a department'){
        console.log('\n');
        promptAddDepartment();
    } else if (answers.menuChoice === 'Add a role'){
        getAllDepartments()
        .then(([rows, fields]) => {
          promptAddRole(rows)
        })
    } else if (answers.menuChoice === 'Add an employee'){
      getAllEmployees()
      .then(([managers, fields]) => {
        promptAddEmployee(managers)
      })
    } else if (answers.menuChoice === `Update an employee's role`){
      getAllEmployees()
      .then(([employees, fields]) => {
        promptUpdateEmployeeRole(employees)
      })
    } else if (answers.menuChoice === `Update an employee's manager`){
      getAllEmployees()
      .then(([employees, fields]) => {
        promptUpdateManager(employees)
      })
    } else if (answers.menuChoice === 'Delete department') {
      console.log('\n');
      getAllDepartments()
      .then(([departments, fields]) => {
        promptDeleteDep(departments)
      })
    } else if (answers.menuChoice === 'Delete role') {
      console.log('\n');
      getAllRoles()
      .then(([roles, fields]) => {
        promptDeleteRole(roles)
      })
    } else if (answers.menuChoice === 'Delete employee') {
      console.log('\n');
      getAllEmployees()
      .then(([employees, fields]) => {
        promptDeleteEmployee(employees)
      })
    } else if (answers.menuChoice === `View total budget utilized by department`) {
      console.log('\n');
      viewBudget()
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    }
  })
};

//function to add a new department
let promptAddDepartment = () =>{
  inquirer.prompt(addDepartmentQuestions)
  .then((answer)=>{
    addDepartment(answer.name)
    .then(() => {
      console.log('\n')
      displayMenu();
    })
  })
  .catch(err => {
    console.log('error addind department:', err);
  })
}

//function to add a new role
const promptAddRole = (departments) =>{
  let questions= addRoleQuestions(departments);
  inquirer.prompt(questions)
  .then((answer)=>{
    addRole(answer)
    .then(() => {
      console.log('\n')
      displayMenu();
    })
  })
  .catch(err => {
    console.log('error adding role:', err);
  })
}

//function to add a new employee
const promptAddEmployee = (managers) =>{
  getAllRoles()
  .then(([roles, fields]) => {
    let questions= addEmployeeQuestions(roles,managers);
    inquirer.prompt(questions)
    .then((answer)=>{
      addEmployee(answer)
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    })
    .catch(err => {
      console.log('error adding employee:', err);
    })
  })
}

//function to update employee's role
const promptUpdateEmployeeRole = (employees) =>{
  getAllRoles()
  .then(([roles, fields]) => {
    let questions= UpdEmpRoleQuestions(roles,employees);
    inquirer.prompt(questions)
    .then((answer)=>{
      updateRole(answer)
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    })
    .catch(err => {
      console.log('error adding employee:', err);
    })
  })
}

//function to update employee's manager
const promptUpdateManager = (employees) =>{
  let questions= updateMangerQuestions(employees);
  inquirer.prompt(questions)
  .then((answer)=>{
    updateManager(answer)
    .then(() => {
      console.log('\n')
      displayMenu();
    })
  })
  .catch(err => {
    console.log('error updating manager:', err);
  })  
}

//delete department
const promptDeleteDep = (Deps) =>{
  let question= deleteDepQuestions(Deps);
  inquirer.prompt(question)
  .then((answer)=>{
    if (answer.department === 'None'){
      displayMenu();
    }else if (answer.department !== 'None'){
      deleteDep(answer)
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    }
    })
  .catch(err => {
    console.log('error deleting department:', err);
  })
}

//delete role
const promptDeleteRole = (roles) =>{
  let question= deleteRoleQuestions(roles);
  inquirer.prompt(question)
  .then((answer)=>{
    if (answer.role === 'None'){
      displayMenu();
    } else if (answer.role !== 'None'){
      deleteRole(answer)
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    }
  })
  .catch(err => {
    console.log('error deleting role:', err);
  })
}

//delete employee
const promptDeleteEmployee = (employees) =>{
  let question= deleteEmployeeQuestions(employees);
  inquirer.prompt(question)
  .then((answer)=>{
    if (answer.employee === 'None'){
      displayMenu();
    } else if (answer.employee !== 'None'){
      deleteEmployee(answer)
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    }
  })
  .catch(err => {
    console.log('error deleting employee:', err);
  })
}

// let displayMenu =() => {
//     return inquirer.prompt(MenuQuestions)
//     .then((answers) => {
//       if (answers.menuChoice === 'Exit'){
//         con.end();
//         console.log('BYE!')
//         return;
//       }else if (answers.menuChoice === 'View all departments') {
//         console.log('\n');
//         displayAllDepartments()
//         .then(() => {
//           console.log('\n')
//           displayMenu();
//         })
//       } else if (answers.menuChoice === 'View all roles') {
//           console.log('\n');
//           displayAllRoles()
//           .then(() => {
//             console.log('\n')
//             displayMenu();
//           })
//       } else if (answers.menuChoice === 'View all employees') {
//         console.log('\n');
//         displayAllEmployees(1)
//           .then(() => {
//             console.log('\n');
//             displayMenu();
//           })
//       } else if (answers.menuChoice === 'View all employees by manager') {
//         console.log('\n');
//         displayAllEmployees(2)
//           .then(() => {
//             console.log('\n');
//             displayMenu();
//           })
//       } else if (answers.menuChoice === 'View all employees by department') {
//         console.log('\n');
//         displayAllEmployees(3)
//           .then(() => {
//             console.log('\n');
//             displayMenu();
//           })
//       } else if (answers.menuChoice === 'Add a department'){
//           console.log('\n');
//           promptAddDepartment();
//       } else if (answers.menuChoice === 'Add a role'){
//           getAllDepartments()
//           .then(([rows, fields]) => {
//             promptAddRole(rows)
//           })
//       } else if (answers.menuChoice === 'Add an employee'){
//         getAllEmployees()
//         .then(([managers, fields]) => {
//           promptAddEmployee(managers)
//         })
//       } else if (answers.menuChoice === `Update an employee's role`){
//         getAllEmployees()
//         .then(([employees, fields]) => {
//           promptUpdateEmployeeRole(employees)
//         })
//       } else if (answers.menuChoice === `Update an employee's manager`){
//         getAllEmployees()
//         .then(([employees, fields]) => {
//           promptUpdateManager(employees)
//         })
//       } else if (answers.menuChoice === 'Delete department') {
//         console.log('\n');
//         getAllDepartments()
//         .then(([departments, fields]) => {
//           promptDeleteDep(departments)
//         })
//       } else if (answers.menuChoice === 'Delete role') {
//         console.log('\n');
//         getAllRoles()
//         .then(([roles, fields]) => {
//           promptDeleteRole(roles)
//         })
//       } else if (answers.menuChoice === 'Delete employee') {
//         console.log('\n');
//         getAllEmployees()
//         .then(([employees, fields]) => {
//           promptDeleteEmployee(employees)
//         })
//       } else if (answers.menuChoice === `View total budget utilized by department`) {
//         console.log('\n');
//         viewBudget()
//         .then(() => {
//           console.log('\n')
//           displayMenu();
//         })
//       }
//     })
//   };
  
  //function to add a new department
  let promptAddDepartment = () =>{
    inquirer.prompt(addDepartmentQuestions)
    .then((answer)=>{
      addDepartment(answer.name)
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    })
    .catch(err => {
      console.log('error addind department:', err);
    })
  }
  
  //function to add a new role
  const promptAddRole = (departments) =>{
    let questions= addRoleQuestions(departments);
    inquirer.prompt(questions)
    .then((answer)=>{
      addRole(answer)
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    })
    .catch(err => {
      console.log('error adding role:', err);
    })
  }
  
  //function to add a new employee
  const promptAddEmployee = (managers) =>{
    getAllRoles()
    .then(([roles, fields]) => {
      let questions= addEmployeeQuestions(roles,managers);
      inquirer.prompt(questions)
      .then((answer)=>{
        addEmployee(answer)
        .then(() => {
          console.log('\n')
          displayMenu();
        })
      })
      .catch(err => {
        console.log('error adding employee:', err);
      })
    })
  }
  
  //function to update employee's role
  const promptUpdateEmployeeRole = (employees) =>{
    getAllRoles()
    .then(([roles, fields]) => {
      let questions= UpdEmpRoleQuestions(roles,employees);
      inquirer.prompt(questions)
      .then((answer)=>{
        updateRole(answer)
        .then(() => {
          console.log('\n')
          displayMenu();
        })
      })
      .catch(err => {
        console.log('error adding employee:', err);
      })
    })
  }
  
  //function to update employee's manager
  const promptUpdateManager = (employees) =>{
    let questions= updateMangerQuestions(employees);
    inquirer.prompt(questions)
    .then((answer)=>{
      updateManager(answer)
      .then(() => {
        console.log('\n')
        displayMenu();
      })
    })
    .catch(err => {
      console.log('error updating manager:', err);
    })  
  }
  
  //delete department
  const promptDeleteDep = (Deps) =>{
    let question= deleteDepQuestions(Deps);
    inquirer.prompt(question)
    .then((answer)=>{
      if (answer.department === 'None'){
        displayMenu();
      }else if (answer.department !== 'None'){
        deleteDep(answer)
        .then(() => {
          console.log('\n')
          displayMenu();
        })
      }
      })
    .catch(err => {
      console.log('error deleting department:', err);
    })
  }
  
  //delete role
  const promptDeleteRole = (roles) =>{
    let question= deleteRoleQuestions(roles);
    inquirer.prompt(question)
    .then((answer)=>{
      if (answer.role === 'None'){
        displayMenu();
      } else if (answer.role !== 'None'){
        deleteRole(answer)
        .then(() => {
          console.log('\n')
          displayMenu();
        })
      }
    })
    .catch(err => {
      console.log('error deleting role:', err);
    })
  }
  
  //delete employee
  const promptDeleteEmployee = (employees) =>{
    let question= deleteEmployeeQuestions(employees);
    inquirer.prompt(question)
    .then((answer)=>{
      if (answer.employee === 'None'){
        displayMenu();
      } else if (answer.employee !== 'None'){
        deleteEmployee(answer)
        .then(() => {
          console.log('\n')
          displayMenu();
        })
      }
    })
    .catch(err => {
      console.log('error deleting employee:', err);
    })
  }

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

const MenuQuestions = {
    type: 'list',
    name: 'menuChoice',
    message: 'What would like to do?',
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
    ],
};

//questions for new department

const addDepartmentQuestions = {
    type: 'input',
    name: 'name',
    message: "Please enter Department's name:",
    validate: nameInput => {
        if(nameInput) {
            return true;
        } else {
            console.log(`Please enter a Department's name`);
            return false;
        }
    },
};

//questions to add new role

const addRoleQuestions = (departments) => {
    let departmentsArr = [];
    departments.forEach( department => {
        let aux = department.id + '.' + department.name;
        departmentsArr.push(aux);
    })
    let Questions = [
        {
            type: 'input',
            name: 'title',
            message: "Please enter Role's title",
            validate: nameInput => {
                if(nameInput) {
                    return true;
                } else {
                    console.log(`Please enter a role's title`);
                    return false;
                }
            },
        },
        {
            type: 'number',
            name: 'salary',
            message: "Please enter Role's salary",
            validate: nameInput => {
                if(nameInput) {
                    return true;

                } else {
                    console.log(`Please enter a role's salary`);
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'menuChoice',
            message: 'Please select the department that role belongs to',
            choices: departmentsArr,
        },
    ];
    return Questions;
}
 const addEmployeeQuestions = (roles, managers) => {
     let rolesArr = [];
     roles.forEach(role => {
         let aux = role.id + '.' + role.title;
         rolesArr.push(aux)
     })
     let managersArr=[];
     managers.forEach(manager => {
         let aux = manager.id + '.' + manager.first_name + '.' + manager.last_name;
         managersArr.push(aux)
     })
     managersArr.push('NULL. No manager to add')
     console.log('rolesArr:', rolesArr);
     console.log(managersArr)
     let Questions = [
         {
             type: 'input',
             name: 'firstName',
             message: "Please enter Employee's first name",
             validate: nameInput => {
                 if(nameInput) {
                     return true
                 } else {
                     console.log(`Please enter Employee's first name`);
                     return false;
                 }
             },
         },
         {
             type: 'input',
             name: 'lastName',
             message: "Please enter Employee's last name",
             validate: nameInput => {
                 if(nameInput) {
                     return true;
                 } else {
                     console.log(`Please enter Employee's last name`);
                     return false;
                 }
             },
         },
         {
             type: 'list',
             name: 'role',
             message: `Please select the employee's role`,
             chocies: rolesArr,
         },
         {
             type: 'list',
             name: 'manager',
             message: 'Please select the manager',
             choices: managersArr,
         },
     ];
     return Questions;
 }

 //questions to display when updating an employee's role
const UpdEmpRoleQuestions = (roles,employees) => {
    //get info from employees and fix it to display it
    let employeesArr=[]; 
    employees.forEach(employee =>{
      let aux = employee.id +'.'+ employee.first_name +' '+ employee.last_name;
      employeesArr.push(aux);
    })
  
    //get info from roles and fix it to display it
    let rolesArr=[]; 
    roles.forEach(role =>{
      let aux = role.id +'.'+ role.title;
      rolesArr.push(aux);
    })
  
    // create question's array
    let questions = [
      {
        type: 'list',
         name: 'employee',
         message: `Please select the employee to modify: `,
         choices: employeesArr,
      },
      {
        type: 'list',
         name: 'role',
         message: `Please select the new role: `,
         choices: rolesArr,
    },  
    ]
    return questions;
  }
  
  //create question's array to update an employee's manager
  const updateMangerQuestions = (employees) => {
    //get info from employees and fix it to display it
    let employeesArr=[]; let managersArr=[]; 
    //add option NULL to the manager's array
    managersArr.push('None')
    employees.forEach(employee =>{
      let aux = employee.id +'.'+ employee.first_name +' '+ employee.last_name;
      employeesArr.push(aux);
      managersArr.push(aux);
    })
      // create question's array
    let questions = [
      {
        type: 'list',
          name: 'employee',
          message: `Please select the employee to modify: `,
          choices: employeesArr,
      },
      {
        type: 'list',
          name: 'manager',
          message: `Please select the new manager: `,
          choices: managersArr,
    },  
    ]
    return questions;
  }


//delete questions

const deleteEmployeeQuestions = (employees) => {
    let employeesArr = [];
    employeesArr.push('None')
    employees.forEach(employee => {
        let aux = employee.id + '.' + employee.first_name + '' + employee.last_name;
        employeesArr.push(aux);
    });

    //questions array
    const question = {
        type: 'list',
        name: 'employee',
        message: `Please select the employee to delete:`,
        choices: employeesArr,
    }
    return question;
}

//delete depart

const deleteDepQuestions = (Deps) => {
    let depsArr = [];
    depsArr.push('None')
    Deps.forEach(dep => {
        let aux = dep.id + '.' + dep.name;
        depsArr.push(aux);
    });
    const question = {
        type: 'list',
        name: 'department',
        message: `Please select the department to delete:`,
        choices: depsArr,
    }
    return question;
}

//queso to delete role
const deleteRoleQuestions = (roles) => {
    let rolesArr = [];
    rolesArr.push('None')
    roles.forEach(role => {
        let aux = role.id + '.' + role.title;
        rolesArr.push(aux);
    });

    const question = {
        type: 'list',
        name: 'role',
        message: `Please select the role to delete:`,
        choices: rolesArr,
    }
    return question;
}
const viewBudgetQuestions = (departments)=> {
    //get info from departments and fix it to display it
    let departmentsArr=[]; 
    departments.forEach(department =>{
      let aux = department.id +'.'+ department.title;
      departmentsArr.push(aux);  
    });
    // create questions array
    const question = {
      type: 'list',
      name: 'department',
      message: `Please select the department to view Total Budget utilized: `,
      choices: departmentsArr,
    }
    return question;
  }

  const displayMany = () => {
    con.end()
};

const addRole = (role) => {
    let getid = role.menuChoice.split(".");
    let depId = parseInt(getid);
    return con.promise().query(
        `INSERT INTO roles SET ?`,
        {
            title: role.title,
            salary: role.salary,
            department_id: depId
        },
    )
    .then (([rows, fields]) => {
        console.log('new role added')
        console.table(role.title);
    })
    .catch(error => {
        if (error) {
            console.log('error adding a new role:', error)
        }
    })
    .then( () => displayMany());
};

//all roles
const displayAllRoles = () => {
    return con.promise().query(
        `SELECT roles.id, title AS Job_Title, salary, name as Department_Name
        FROM roles
        INNER JOIN departments ON roles.department_id = departments.id;`)
        .then (([rows, fields]) => {
            console.log('\n\n Roles......')
            console.table(rows);
        })
        .catch(error => {
            if(error) {
            console.log('error connecting with database to display all roles', error)
        }
})

};

//roles to disploay

const getAllRoles = () => {
    return con.promise().query("SELECT id, title FROM roles")
}

//delete a role

const deleteRole = (role) => {
    let id = 0;

    let getId = role.role.split(".");

    id = parseInt(getId[0]);
    return con.promise().query(
        `DELETE FROM roles WHERE roles.id = ?`, id)
        .then (([rows, fields]) => {
            console.log(`role ${getId[1]} deleted`)
        })
        .catch(error => {
            if (error) {
                console.log(`error deleting role:`, error)
            }
        })
}

