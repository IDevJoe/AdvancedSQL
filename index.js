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
module.exports.query = function(query, values, callback) {
    if(callback === undefined) {
        module.exports.debugLog("Running query: "+query);
        return module.exports.connection.query(query, values);
    }
    module.exports.debugLog("Running query: "+query+" with params "+JSON.stringify(values));
    return module.exports.connection.query(query, values, callback);
};
module.exports.debugLog = function() {};