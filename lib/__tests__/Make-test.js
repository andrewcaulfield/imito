jest.unmock('../cmds/make.js');
jest.mock('fs');
jest.mock('path');

describe('lib/sync', () => {
		 let MakeCommand,
          path,
          fs,
          program;

    beforeEach(() => {

        MakeCommand = require('../cmds/make');
        fs = require('fs');
        path = require('path');
        program = require('commander');

    });

    it('should create a .env stub on the root of the project', () => {

    	program
        	.parse(process.argv);

        // run the make command
       	new MakeCommand(program)._executeMake();

        const env = path.join(__dirname, '/../../.env');
        // check that .env file is now in the project root.
        expect(fs.existsSync(+env)).toEqual(1);
    });
});
