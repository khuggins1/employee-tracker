const inquirer = require('inquirer');

const { getAllDepartments, addDepartment } = require('../utils/departments');
const con = require('../db/database');
const { choices } = require('yargs');

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

//display menu

const displayMenu = () => {
return inquirer.prompt(MenuQuestions)
.then((answers) => {
    if(answers.menuChoice === 'Exit') {
        con.end();
        console.log('BYE BYE!')
        return:
    } else if (answers.menuChoice === 'View all departments') {
        console.log('\n');
        getAllDepartments()
        .then(() => {
            console.log('\n')
            displayMenu();
        })
    } else if (answers.menuChoice === 'Add a department') {
        console.log('\n enter to add a new department');
        promptAddDepartment()
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
        console.log('error', err);
    })
}

module.exports = displayMenu;