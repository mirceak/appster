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

<<<<<<< HEAD
    force_exit(process){
        switch (process.platform)
        {
            case "win32":
                child_process.exec('taskkill /pid ' + process.pid + ' /f /t')
                console.log("APPSTER____________________________________________________________________________________________________Force Killed Shell with pid: "+process.pid)
                break;

        };
    };

=======
>>>>>>> origin/dev
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