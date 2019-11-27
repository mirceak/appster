'use strict'

//appster modules
let utils;
let api;

//remote modules
let express;

//private vars

let listen = async ()=>{
    return new Promise(async resolve => {
        if (!express) express = await utils.require('express');
        const app = express()
        const port = 8080

        app.get('/', (req, res) => res.send('Hello World!'))

        app.listen(port, () => {
            console.log("APPSTER____________________________________________________________________________________________________http api server started.");
            resolve();
        })
    });
}

class Server{
    constructor(){
        return this;
    }

    async start(){
        await listen();
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;

    api = await require('./api.js').promise;

    resolve(new Server());
});