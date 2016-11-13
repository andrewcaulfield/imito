const Sync = require('../sync');
const Dotenv = require('dotenv').config();

class SyncCommand {

    constructor(program) {
        this._program = program;
    }

    exec() {
        return this._executeSync();
    }

    _executeSync() {
        if(this._program.args == 'database') {
            console.log('in the database');
        } else {
            console.log('in the assets');
            console.log(Dotenv.DB_HOST);
        }
    }
}

module.exports = SyncCommand;