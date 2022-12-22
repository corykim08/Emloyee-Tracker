const mysql = require('mysql2');

// connect mysql

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee'
    },
);

module.exports = db