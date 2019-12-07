'use strict'

//appster modules
let utils;
let shell;
let api;

//remote modules

//private vars

let listen_frontend = async ()=>{
    return new Promise(async resolve => {
        console.log(3);
        let child_shell = await shell.run_command("cd app \n npm run serve -- --port 80 \n", true);

        console.log(4);
        child_shell.stdout.on('data', (data) => {
            if (data.includes("To create a production build, run npm run build.")){
                resolve();
            }
        });
    });
}

let listen_api = async ()=>{
    console.log(1);
    await api.start();
}

class Server{
    constructor(){
        return this;
    }

    async start(){
        await listen_api();
        console.log(2);
        await listen_frontend();
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    api = await require('./api.js').promise;

    resolve(new Server());
});