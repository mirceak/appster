'use strict'

//appster modules

//remote modules
let child_process = require('child_process');

//private vars
let spawn;

class Shell{
    constructor(){
        return this;
    }

    async run_command(command){
        return new Promise(resolve => {
            let process = spawn(command ,{stdio:[0,1,2]});
            resolve(process);
        })
    }
}

exports.promise = new Promise(async resolve => {
    spawn = child_process.execSync;

    resolve(new Shell());
});