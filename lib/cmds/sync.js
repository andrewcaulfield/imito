const Sync = require('../sync'),
      mysql = require('mysql');

class SyncCommand {

    constructor(program) {
        this._program = program;
    }

    exec() {
        return this._executeSync();
    }

    _executeSync() {
        if (this._program.args == 'database') {
            console.log('in the database');
            var connection = mysql.createConnection({
                host: Dotenv.REMOTE_DB_HOST,
                user: Dotenv.REMOTE_DB_USER,
                password: Dotenv.REMOTE_DB_PASS,
                database: Dotenv.REMOTE_DB_NAME,
                port: Dotenv.REMOTE_DB_PORT
            });

            connection.connect(function(err) {
                if (!err) {
                    console.log("Database is connected ... nn");
                    connection.query('SELECT * from counties LIMIT 2', function(err, rows, fields) {
                        if (!err)
                            console.log('The solution is: ', rows);
                        else
                            console.log('Error while performing Query.');
                    });
                } else {
                    console.log("Error connecting database ... nn");
                }
            });
        } else {
            console.log('in the assets');
            console.log(Dotenv.DB_HOST);
        }
    }
}

module.exports = SyncCommand;
