'use strict'

//appster modules

//remote modules
let child_process = require('child_process');

//private vars
let spawn;

let get_process = ()=>{
    let process = spawn('cmd');

    process.stdout.on('data', (data) => {
        console.log("" + data);
    });
    process.stderr.on('data', (data) => {
        console.log("" + data);
    });

    return process;
};

class Shell{
    constructor(){
        return this;
    }

    force_exit(process){
        switch (process.platform)
        {
            case "win32":
                child_process.exec('taskkill /pid ' + process.pid + ' /f /t')
                console.log("APPSTER____________________________________________________________________________________________________Force Killed Shell with pid: "+process.pid)
                break;

        };
    };

    async run_command(command, permanent = false){
        return new Promise(resolve => {
            let process = get_process();

            process.stdin.write(command);

            process.on('exit', (code) => {
                console.log(`Shell process exited with code ${code}`);

                process = null;

                if (!permanent) {
                    resolve();
                }
            });

            if (permanent){
                resolve(process);
            }
        })
    }
}

exports.promise = new Promise(async resolve => {
    spawn = child_process.spawn;

    resolve(new Shell());
});