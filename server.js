const cTable = require('console.table');
require('dotenv').config();

const inquirer = require('inquirer');

const db = require('./db/database');


const displayMenu = require('./utils/displayMenu');

const { addEmployee, updateRole, getAllEmployees, addingEmployee} = require('./utils/employees');


displayMenu()
.then(() => {
    console.log('\n');
})
.catch(err => {
    console.log(err);
});