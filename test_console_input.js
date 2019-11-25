const { spawn } = require('child_process');
const child = spawn('cmd.exe');
child.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
});
var commands = ["vue create app \n"]
var w = false;
var x = true;
child.stdout.on('data', (data) => {
    console.log(`stdout:_________________________________________\n ${data}`);

    if (commands.length)
        child.stdin.write(commands[0]);

    if (data.includes("Please pick a preset:") && x){console.log(3);
        child.stdin.write('\x104');
        if (w==false){
            w=true;
            return;
        }
        x = false;
        child.stdin.write('\x104');
    }

    commands.splice(0, 1);
});
child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});