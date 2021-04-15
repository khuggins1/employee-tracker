const cTable = require('console.table');

const con = require('./db/database');
const { CONNREFUSED } = require('dns');

const displayMany = () => {

    con.end()
};

const addDepartment = name => {
    return con.promise().query(
        'INSERT INTO departments SET ?',
        {
            name:name
        },
    )
   .then(([rows, fields]) => {
       console.log('department  added')
   })
    .catch(error => {
        if(error) {
            console.log(error)
        }
    })
    .then( () => getAllDepartments());

};

//all dep
const displayAllDepartments = () => {
    return con.promise().query ("SELECT * FROM departments")
    .then(([rows, fields]) => {
        console.log('\n\n Departments......');
        console.table(rows);
    })
    .catch(error => {
        if(error) {
            console.log('error connecting with database')
        }
    })
    .then( () => displayMany());
};

const getAllDepartments = () => {
    return con.promise().query("SELECT * FROM departments")
}

//delete department

const deleteDep = (data) => {
    let id = 0;

    let getId = data.addDepartment.split(".");
    id=parseInt(getId[0]);
    return con.promise().query(
        `DELETE FROM departments WHERE departments.id = ?`, id)
        .then(([ rows, fields]) => {
            console.log(`department ${getId[1]} deleted`)
        })
        .catch (error => {
            if(error) {
                console.log(`eror deleting department:`, error)
            }
        })
}
module.exports = { displayAllDepartments, getAllDepartments, addDepartment, deleteDep };