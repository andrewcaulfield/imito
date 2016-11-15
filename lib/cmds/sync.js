const mysql = require('mysql'),
    mysqlDump = require('mysqldump'),
    Dotenv = require('dotenv').config(),
    fs = require('fs'),
    dir = './databases';

class SyncCommand {

    constructor(program) {
        this._program = program;
    }

    exec() {
        return this._executeSync();
    }

    _executeSync() {
        if (this._program.args == 'database') {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            mysqlDump({
                host: Dotenv.REMOTE_DB_HOST,
                user: Dotenv.REMOTE_DB_USER,
                password: Dotenv.REMOTE_DB_PASS,
                database: Dotenv.REMOTE_DB_NAME,
                port: Dotenv.REMOTE_DB_PORT,
                dest: process.cwd() + '/databases/data.sql' // destination file
            }, function(err) {
                if (!err) {
                    console.log('Database dump completed');

                    var connection = mysql.createConnection({
                        host: Dotenv.REMOTE_DB_HOST,
                        user: Dotenv.REMOTE_DB_USER,
                        password: Dotenv.REMOTE_DB_PASS,
                        database: Dotenv.LOCAL_DB_NAME,
                        port: Dotenv.REMOTE_DB_PORT,
                        multipleStatements: true
                    });

                    var sql = fs.readFileSync(process.cwd() + '/databases/data.sql').toString();
                    connection.connect(function(err) {
                        if (!err) {
                            console.log("Database is connected ... nn");
                            connection.query(sql, function(err) {
                                if (!err)
                                    console.log('Database imported')
                                else {
                                    console.log(err);
                                }
                            });
                        } else {
                            console.log(err);
                            console.log("Error connecting database ... nn");
                        }
                    });

                } else {
                    console.log(err);
                }
            });


        } else {
            // TODO: Handle this error
        }
    }
}

module.exports = SyncCommand;
