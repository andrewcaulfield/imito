const fs = require('fs'),
	  path = require("path"),
	  dir = 'stubs/.env';
class MakeCommand {

    constructor(program) {
        this._program = program;
    }

    exec() {
        return this._executeMake();
    }

     _executeMake() {
     	fs.createReadStream(path.join(__dirname, '/..', '/stubs/.env')).pipe(fs.createWriteStream(path.join(__dirname, '/../../.env')));
     }
}

module.exports = MakeCommand;
