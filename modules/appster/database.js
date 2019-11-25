'use strict'

//appster modules
let shell;

//remote modules
const Sequelize = require('sequelize');

//private vars

let start_service = async ()=>{
    return new Promise(async resolve => {
        let shell_process = await shell.run_command('.\\3rdPartyFiles\\mariadb10.4.10\\bin\\mysqld \n', true);

        shell_process.stderr.on('data', (data) => {
            if ((data.toString()+"").includes("starting as process")){
                console.log("APPSTER____________________________________________________________________________________________________mysql service started.");
                resolve();
            }
        });
    });
};

let start_client = async ()=>{
    const sequelize = new Sequelize('mysql', 'root', null, {
        dialect: 'mariadb',
        dialectOptions:
            {
                connectTimeout: 1000
            }// mariadb connector option
    })

    await sequelize
        .authenticate()
        .then(async () => {
            console.log('Connection has been established successfully.');

            // await sequelize.query("CREATE DATABASE appster").then(([results, metadata]) => {
            //     // Results will be an empty array and metadata will contain the number of affected rows.
            //     console.log(results, metadata);
            // })

            // await sequelize.query("SHUTDOWN WAIT FOR ALL SLAVES;").then(([results, metadata]) => {
            //     // Results will be an empty array and metadata will contain the number of affected rows.
            //     console.log(results, metadata);
            // })
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err.original.code);
        });
}

class Database{

    async start(){
        //we start the mysql service. this means our database will be running in a shell process.
        await start_service();

        //we start the database client. we use this to communicate with our database service.
        await start_client();
    }
}

exports.promise = new Promise(async resolve => {
    shell = await require('./shell.js').promise;

    resolve(new Database());
});