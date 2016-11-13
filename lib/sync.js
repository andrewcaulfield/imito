const Dotenv = require('dotenv').config();

class Sync  {
    constructor() {
        this.start;

        this.end;
    }
    getExecutionTime() {
        return `${this.end[0]}s:${Math.round(this.end[1]/1000000)}ms`;
    }

}

module.exports = Sync;