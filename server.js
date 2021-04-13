const cTable = require('console.table');
require('dotenv').config();

const inquirer = require('inquirer');

const db = require('./db/database')

const { getAlldepartments, addDepartment} = require('./utils/departments');
const { getAllRoles, addRoles } = require('./utils/roles');

getAllRoles();