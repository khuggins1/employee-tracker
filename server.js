const cTable = require('console.table');
require('dotenv').config();

const inquirer = require('inquirer');

const db = require('./db/database');


const displayMenu = require('./utils/displayMenu');

const { addEmployee, updateRole, getAllEmployees, addingEmployee} = require('./utils/employees');




// get the client
const mysql = require('mysql2');
// create the connection
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER, 
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});
con.promise().query("SELECT * FROM employees")
  .then( ([rows,fields]) => {
    console.table(rows);
  })
  .catch(
      console.log('an error ocurred'))
  .then( () => con.end()); 
// displayMenu()
// .then(() => {
//     console.log('\n');
// })
// .catch(err => {
//     console.log(err);
// });