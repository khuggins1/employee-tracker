const cTable = require('console.table');

const con = require('./db/database');

const displayMany = () => {

    con.end()
};

const addDepartment = name => {
    con.promise().query (
        'INSERT INTO departments SET ?',
        {
            name:name
        },
    )
    .then(([rows, fields]) => {
        console.log('enter here')
        console.table(rows);
    })
    .catch(error => {
        if(error) {
            console.log(error)
        }
    })
    .then( () => getAllDepartments());

};

//all dep
const getAllDepartments = () => {
    con.promise().query ("SELECT * FROM departments")
    .then(([rows, fields]) => {
        console.log('Departments......')
        console.table(rows);
    })
    .catch(error => {
        if(error) {
            console.log('error connecting with database')
        }
    })
    .then( () => displayMany());
};

module.exports = { getAllDepartments, addDepartment };