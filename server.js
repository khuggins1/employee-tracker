const cTable = require('console.table');
require('dotenv').config();

const inquirer = require('inquirer');

const db = require('./db/database');

const { getAllDepartments, addDepartment} = require('./utils/departments');
const { getAllRoles, addRole } = require('./utils/roles');

const { getAllEmployees, addEmployee, updateRole} = require('./utils/employees');

const displayMenu = require('./utils/displayMenu');

const { NULL } = require('mysql2/lib/constants/types');

// addEmployee('Mark', 'Chad', 8);

// updateRole();

displayMenu()
.then(() => {
    console.log('\n');
})
.catch(err => {
    console.log(err);
});