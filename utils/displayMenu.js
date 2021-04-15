const inquirer = require('inquirer');

const {displayAllDepartments, addDepartment, getAllDepartments, deleteDep} = ('../utils/departments');
const { displayallRoles, addRole, getAllRoles, deleteRole} = require('../utils/roles')
const con = require('../db/database');
const { addEmployee, updateRole, displayAllEmployees, getAllEmployees, updateManager, delteEmployee, deleteEmployee} = require('../utils/employees');
const { MenuQuestions, addDepartmentQuestions, addRoleQuestions, addEmployeeQuestions, upEmpRoleQuesions, updateManagerQuestions, deleteEmployeeQuestions, deleteDepQuestions, deleteRoleQuestions} = require('../utils/questions')

const MenuQuestions = {
    type: 'list',
    name: 'menuChoice',
    message:'What would you like to do?',
    choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'

    ],
};

const addDepartmentQuestions = {
    type: 'input',
    name: 'name',
    message: "Please enter a Department's name:",
    validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log(`Please enter a Department's name`);
            return false;
        }
    },
};



//questions


const addRoleQuestions = (departments) => {
    let departmentsArr= [];
    departments.forEach(department => {
        let aux = department.id + '.' + department.name;
        departmentsArr.push(aux);
    })
    let Questions = [
        {
            type: 'input',
            name: 'title',
            message: "Please enter Role's title: (Require)",
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
            type:'number',
            name: 'salary',
            message: "Please enter Role's salary: (Require)",
            validate: nameInput => {
                if (nameInput) {
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
            message: "What would you like to do?",
            choices: departmentsArr,
        },
    ];


return Questions; 
}
//display menu

const displayMenu = () => {
return inquirer.prompt(MenuQuestions)
.then((answers) => {
    if(answers.menuChoice === 'Exit') {
        con.end();
        console.log('BYE BYE!')
        return;
    } else if (answers.menuChoice === 'View all departments') {
        console.log('\n');
        displayAllDepartments()
        .then(() => {
            console.log('\n')
            displayMenu();
        })
    } else if (answers.menuChoice === 'View all roles') {
        console.log('\n');
        getAllRoles()
        .then(() => {
            console.log('\n')
            displayMenu()
        })
    } else if (answer.menuChoice === 'Add a role') {
        getAllDepartments()
        .then(([rows, fields]) => {
            promptAddRole(rows)
        })
    }
})
};

//add department
const promptAddDepartment = () => {
    inquirer.prompt(addDepartmentQuestions)
    .then((answers) => {
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
const promptAddRole = (department) => {
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
const promptDleteRole = (roles) => {
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