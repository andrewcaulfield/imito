const Sync = require('../sync'),
    mysql = require('mysql'),
    execsql = require('execsql'),
    mysqlDump = require('mysqldump'),
    Dotenv = require('dotenv').config(),
    fs = require('fs'),
    readline = require('readline'),
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
                        user: Dotenv.LOCAL_DB_USER,
                        password: Dotenv.LOCAL_DB_PASS,
                        database: Dotenv.LOCAL_DB_NAME,
                        port: Dotenv.LOCAL_DB_PORT
                    });
                    var rl = readline.createInterface({
                        input: fs.createReadStream(process.cwd() + '/databases/data.sql'),
                        terminal: false
                    });
                    rl.on('line', function(chunk) {
                        connection.query(chunk.toString('ascii'), function(err, sets, fields) {
                            if (err) console.log(err);
                        });
                    });
                    rl.on('close', function() {
                        console.log("finished");
                        connection.end();
                    });

                } else {
                    console.log(err);
                }
            });


        } else {
            console.log('in the assets');
            console.log(Dotenv.DB_HOST);
        }
    }
}

module.exports = SyncCommand;
