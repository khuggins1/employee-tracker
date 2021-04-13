const cTable = require('console.table');
require('dotenv').config();

const inquirer = require('inquirer');

const db = require('./db/database')

const { getAlldepartments, addDepartment} = require('.')

addDepartment('testing');