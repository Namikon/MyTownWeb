const mysql = require('mysql');

exports.getMysqlConnection = function() {
    return mysql.createConnection(
        {
            host: gConfig.mytown_db_server,
            port: gConfig.mytown_db_port,
            user: gConfig.mytown_db_username,
            password: gConfig.mytown_db_password,
            database: gConfig.mytown_db_databasename
        });
};