const inquirer = require('inquirer');

const {displayAllDepartments, addDepartment, getAllDepartments, deleteDep} = ('../utils/departments');
const { displayallRoles, addRole, getAllRoles, deleteRole} = require('../utils/roles')
const con = require('../db/database');
const { addEmployee, updateRole, displayAllEmployees, getAllEmployees, updateManager, delteEmployee, deleteEmployee} = require('../utils/employees');
const { MenuQuestions, addDepartmentQuestions, addRoleQuestions, addEmployeeQuestions, upEmpRoleQuesions, updateManagerQuestions, deleteEmployeeQuestions, deleteDepQuestions, deleteRoleQuestions} = require('../utils/questions')




//function to display menu
const displayMenu =() => {
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

            
//add department
const promptAddDepartment = () => {
    inquirer.prompt(addDepartmentQuestions)
    .then((answer) => {
        console.log(answer.name);
        addDepartment(answer.name)
        .then(() => {
            console.log('\n')
            displayMenu();
        })
    })
    .catch(err => {
        console.log('error add id departments:', err);
    })
}

//new role
const promptAddRole = (departments) => {
    let questions = addDepartmentQuestions(departments);
    inquirer.prompt(questions)
    .then((answer) => {
        addRole(answer)
        .then (() => {
            console.loog('\n')
            displayMenu();
        })
    })
    .catch(err => {
        console.log('error adding role:', err);
    })
}

const promptAddEmployee = (managers) => {
    getAllRoles()
    .then(([roles, fields]) => {
        let questions = addEmployeeQuestions(roles, managers);
        inquirer.prompt(questions)
        .then ((answer) => {
            console.log('\n')
            displayMenu();
        })
    })
    .catch(err => {
        console.log('error adding employee', err);
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
const promptDeleteDep = (Deps) => {
    let question = deleteDepQuestions(Deps);
    inquirer.prompt(question)
    .then ((answer) => {
        if(answer.department === 'None'){
        displayMenu();
    } else if (answer.department !== 'None') {
        deleteDep(answer)
        .then(() => {
            console.log('\n')
            displayMenu();
        })
    }
    })
    .catch(err => {
        console.log(`error deleting department:`, err);
    })
}

//delete Role
const promptDeleteRole = (roles) => {
    let question = deleteRoleQuestions(roles);
    inquirer.prompt(question)
    .then ((answer) => {
        if (answer.role === 'None') {
            displayMenu();
        } else if (answer.role !== 'None') {
            deleteRole(answer)
            .then(() => {
                console.log('\n')
                displayMenu();
            })
        }
    })
    .catch(err => {
        console.log(`error deleting role:`, err);
    })
}
//delete employee
const promptDeleteEmployee = (employees) => {
    let question= deleteEmployeeQuestions(employees);
    inquirer.prompt(question)
    .then((answer) => {
        if(answer.employee === 'None'){
            displayMenu();
        } else if (answer.employee !== 'None') {
            deleteEmployee(answer)
            .then(() => {
                console.log('\n')
                displayMenu();
            })
        }
    })

.catch (err => {
    console.log(`error deleting employee:`, err);
})
}
module.exports = displayMenu;