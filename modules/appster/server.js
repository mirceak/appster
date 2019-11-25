'use strict'

//appster modules
let api;

//remote modules
const express = require('express')

//private vars

let listen = async ()=>{
    return new Promise(resolve => {
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
    api = await require('./api.js').promise;

    resolve(new Server());
});