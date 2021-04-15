const cTable = require('console.table');

const con = require('../db/database');

const displayMany = () => {
    con.end()
};

const addRole = (role) => {
    let getid = role.menuChoice.split(".");
    let depId = parseInt(getid);
    return con.promise().query(
        `INSERT INTO roles SET ?`,
        {
            title: role.title,
            salary: role.salary,
            department_id: depId
        },
    )
    .then (([rows, fields]) => {
        console.log('new role added')
        console.table(role.title);
    })
    .catch(error => {
        if (error) {
            console.log('error adding a new role:', error)
        }
    })
    .then( () => displayMany());
};

//all roles
const displayAllRoles = () => {
    return con.promise().query(
        `SELECT roles.id, title AS Job_Title, salary, name as Department_Name
        FROM roles
        INNER JOIN departments ON roles.department_id = departments.id;`)
        .then (([rows, fields]) => {
            console.log('\n\n Roles......')
            console.table(rows);
        })
        .catch(error => {
            if(error) {
            console.log('error connecting with database to display all roles', error)
        }
})

};

//roles to disploay

const getAllRoles = () => {
    return con.promise().query("SELECT id, title FROM roles")
}

//delete a role

const deleteRole = (role) => {
    let id = 0;

    let getId = role.role.split(".");

    id = parseInt(getId[0]);
    return con.promise().query(
        `DELETE FROM roles WHERE roles.id = ?`, id)
        .then (([rows, fields]) => {
            console.log(`role ${getId[1]} deleted`)
        })
        .catch(error => {
            if (error) {
                console.log(`error deleting role:`, error)
            }
        })
}
module.exports = { displayAllRoles, getAllRoles, addRole, deleteRole};