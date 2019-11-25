'use strict'

//appster modules

//remote modules
let child_process = require('child_process');

//private vars
let spawn;
let shell_process;
let shell_command;

let has_process = ()=>{
    return shell_process != null;
};

let get_process = (permanent = false)=>{
    if (!has_process()){
        switch (process.platform)
        {
            case "win32":
                shell_process = spawn('cmd');
                break;

        };

        shell_process.stdout.on('data', (data) => {
            if (shell_command){
                console.log("APPSTER____________________________________________________________________________________________________Executing shell command: " + shell_command)
                shell_command = null;
            }else{
                console.log("" + data);
            }
        });
        shell_process.stderr.on('data', (data) => {
            console.log(shell_command ? shell_command : "" + ` :\n ${data}`);
        });
    }
};

class Shell{
    constructor(){
        return this;
    }

    force_exit(){
        if (!has_process()) return;

        console.log("APPSTER____________________________________________________________________________________________________Force Kill Shell")
        switch (process.platform)
        {
            case "win32":
                child_process.exec('taskkill /pid ' + shell_process.pid + ' /f /t')
                break;

        };
    };

    async run_command(command, permanent = false){
        return new Promise(resolve => {
            if (!has_process())
                get_process(permanent);

            shell_command = command;

            shell_process.stdin.write(command);

            shell_process.on('exit', (code) => {
                console.log(`Shell process exited with code ${code}`);

                shell_command = null;
                shell_process = null;

                if (!permanent) {
                    resolve();
                }
            });

            if (permanent){
                resolve(shell_process);
            }
        })
    }
}

exports.promise = new Promise(async resolve => {
    spawn = child_process.spawn;

    resolve(new Shell());
});