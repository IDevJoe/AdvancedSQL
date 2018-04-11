// Imports
const mysql = require('mysql');

// Exports
module.exports.connection = null;
module.exports.connect = function(connection_options, pool = false) {
    if(module.exports.connection !== null) module.exports.connection.end();
    if(!pool)
        module.exports.connection = mysql.createConnection(connection_options);
    else
        module.exports.connection = mysql.createPool(connection_options);
    return module.exports.connection;
};
module.exports.Table = require('./Table');
module.exports.Condition = require('./Condition');