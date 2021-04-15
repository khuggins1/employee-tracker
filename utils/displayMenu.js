const inquirer = require('inquirer');

const { displayAllDepartments, getAllDepartments, addDepartment } = require('../utils/departments');

const { addEmloyee, updateRole, displayALLEmployees, getAllEmployees } = require('../utils/employees');
const { MenuQuestions, addDepartmentQuestions, addRoleQuestions, addEmployeeQuestions} = require('../utils/questions')
const con = require('../db/database');
const { getAllRoles } = require('./roles');


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

module.exports = displayMenu;