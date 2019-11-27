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
        //our database - used for remembering information
        await dependencies.load();
    }

    async start_database(){
        //a database needs it's own environment that runs code. we can call that a service. mariadb needs it's service to be started
        await database.start();
    };

    async start_server(){
        //the api is a group of functions we use for the website to be able to communicate with our server. we need the website to be able to access the database for example and we should never do that directly.
        //the website asks the server and the server asks the database. this will help avoid someone hacking your database and stealing your data.
        //any sensitive information should be processed only by the server never by the website because the website is insecure.
        //the website should only ask the server questions and show the answers in order to be secure.
        await server.start();
    };
}

//exports is the object that gets returned when writing "var main = require('main.js')". So just like in index.js you can then say main.promise or whatever you would need in addition
exports.promise = new Promise(async resolve => {
    dependencies = await require('./dependencies.js').promise;
    database = await require('./database.js').promise;
    server = await require('./server.js').promise;

    resolve(new Main());
});