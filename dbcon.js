var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_yakovenk',
  password        : '3490',
  database        : 'cs340_yakovenk',
  multipleStatements: true
});

module.exports.pool = pool;
