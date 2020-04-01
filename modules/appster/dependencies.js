'use strict'

//appster modules
let utils;
let shell;

//remote modules

//private vars


let load_backend_packages = async ()=>{
    await shell.run_command('npm install');
}

let load_frontend_packages = async ()=>{
    await shell.run_command('cd app/ && npm install');
}

class Dependencies{
    constructor(){
        return this;
    }

    async load(){
        await load_backend_packages();
        await load_frontend_packages();
        console.log("APPSTER____________________________________________________________________________________________________Dependencies loaded!");
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Dependencies());
});