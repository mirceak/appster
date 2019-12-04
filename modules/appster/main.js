'use strict'

//appster modules
let dependencies;
let database;
let server;

//remote modules

//private vars

class Main{
    constructor(){
        return this;
    }

    async load_dependencies(){
        await dependencies.load();
    }

    async start_database(){
        await database.start();
    };

    async start_server(){
        await server.start();
    };
}

exports.promise = new Promise(async resolve => {
    dependencies = await require('./dependencies.js').promise;
    database = await require('./database.js').promise;
    server = await require('./server.js').promise;

    resolve(new Main());
});