'use strict'

//appster modules
let config = require('../../config/appster_config.js');
let utils;
let shell;
let api;

//remote modules

//private vars

let build_frontend = async ()=>{
    return new Promise(async resolve => {
        await shell.run_command("cd app \n npm run build \n exit \n");
        resolve();
    });
}

let listen_api = async ()=>{
    await api.start();
}

class Server{
    constructor(){
        return this;
    }

    async start(){
        await build_frontend();
        await listen_api();
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    api = await require('./api.js').promise;

    resolve(new Server());
});