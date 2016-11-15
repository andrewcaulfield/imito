const mysql = require('mysql'),
    mysqlDump = require('mysqldump'),
    Dotenv = require('dotenv').config(),
    fs = require('fs'),
    Q = require('q'),
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

            var MysqlBackup = function(connectionInfo, filename) {
                var self = this;
                this.backup = '';

                this.connection = require('mysql').createConnection(connectionInfo);

                function getTables() {
                    return Q.ninvoke(self.connection, 'query', 'SHOW TABLES');
                };

                function doTableEntries(theResults) {

                    var tables = theResults[0];

                    var tableDefinitionGetters = [];
                    for (var i = 0; i < tables.length; i++) {
                        var tableName = tables[i]['Tables_in_' + connectionInfo.database];

                        tableDefinitionGetters.push(Q.ninvoke(self.connection, 'query', 'SHOW CREATE TABLE ' + tableName)
                            .then(recordEntry(tableName)));
                    }
                    return Q.allSettled(tableDefinitionGetters);
                };

                function recordEntry(tableName) {
                    return function(createTableQryResult) {
                        self.backup += "DROP TABLE " + tableName + ";\n\n";
                        self.backup += createTableQryResult[0][0]["Create Table"] + "\n\n";
                    };
                };

                function saveFile() {
                    return (Q.denodeify(require('fs').writeFile))(filename, self.backup);
                }

                Q.ninvoke(this.connection, 'connect')
                    .then(getTables)
                    .then(doTableEntries)
                    .then(saveFile)
                    .then(function() { console.log('Success'); })
                    .catch(function(err) { console.log('Something went awry', err); })
                    .then(function() { self.connection.destroy(); })
                    .then(importDatabase)
                     .finally( function() {self.connection.destroy(); } );
            };

            var myConnection = {
                host: Dotenv.REMOTE_DB_HOST,
                user: Dotenv.REMOTE_DB_USER,
                password: Dotenv.REMOTE_DB_PASS,
                database: Dotenv.REMOTE_DB_NAME,
                port: Dotenv.REMOTE_DB_PORT
            };

            new MysqlBackup(myConnection, './backup.sql');

            function importDatabase() {

                var connection = mysql.createConnection({
                    host: Dotenv.REMOTE_DB_HOST,
                    user: Dotenv.REMOTE_DB_USER,
                    password: Dotenv.REMOTE_DB_PASS,
                    database: Dotenv.LOCAL_DB_NAME,
                    port: Dotenv.REMOTE_DB_PORT,
                    multipleStatements: true
                });

                var sql = fs.readFileSync(process.cwd() + '/backup.sql').toString();
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

            }

        } else {
            // TODO: Handle this error
        }
    }
}

module.exports = SyncCommand;
