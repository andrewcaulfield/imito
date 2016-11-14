const Sync = require('../sync'),
    mysql = require('mysql'),
    mysqlDump = require('mysqldump'),
    Dotenv = require('dotenv').config(),
    fs = require('fs');

class SyncCommand {

    constructor(program) {
        this._program = program;
    }

    exec() {
        return this._executeSync();
    }

    _executeSync() {
        if (this._program.args == 'database') {

            mysqlDump({
                host: Dotenv.REMOTE_DB_HOST,
                user: Dotenv.REMOTE_DB_USER,
                password: Dotenv.REMOTE_DB_PASS,
                database: Dotenv.REMOTE_DB_NAME,
                port: Dotenv.REMOTE_DB_PORT,
                dest: process.cwd() + '/database/data.sql' // destination file
            }, function(err) {
                if (!err) {
                    console.log('Database dump completed');

                } else {
                    console.log(err);
                }
            });

            // TODO - Import newly created SQL dump into local environment
            var sql = fs.readFileSync('init_database.sql').toString();

            pg.connect('postgres://test:test@localhost/test', function(err, client, done) {
                if (err) {
                    console.log('error: ', err);
                    process.exit(1);
                }
                client.query(sql, function(err, result) {
                    done();
                    if (err) {
                        console.log('error: ', err);
                        process.exit(1);
                    }
                    process.exit(0);
                });
            });

        } else {
            console.log('in the assets');
            console.log(Dotenv.DB_HOST);
        }
    }
}

module.exports = SyncCommand;
