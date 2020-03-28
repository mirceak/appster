'use strict'

//appster modules
let utils;
let shell;

//remote modules
let Sequelize;

//private vars
let db_name = 'appster'

let start_service = async ()=>{
    return new Promise(async resolve => {
        let shell_process;
        if (await utils.file_exists('./3rdPartyFiles/mariadb/data')){
            await start_mysql_service(shell_process);
        }else{
            console.log('Installing mysql databases.');
            await shell.run_command("cd 3rdPartyFiles/mariadb/bin && mysql_install_db start");
            await start_mysql_service(shell_process);
        }

        if(!await utils.file_exists('./3rdPartyFiles/mariadb/data/appster')){
            await create_database(db_name);
        }

        resolve();
    });
};

let start_mysql_service = async (shell_process) => {
    shell_process = await shell.run_command('.\\3rdPartyFiles\\mariadb\\bin\\mysqld \n', true);

    shell_process.stderr.on('data', (data) => {
        if ((data.toString()+"").includes("starting as process")){
            console.log("APPSTER____________________________________________________________________________________________________mysql service started.");
        }
    });
}

let create_database = async (database)=>{
    return new Promise(async resolve => {
        if (!Sequelize){
            Sequelize = await utils.require('sequelize');
        }
        const sequelize = new Sequelize('mysql', 'root', null, {
            dialect: 'mariadb',
            dialectOptions:
                {
                    connectTimeout: 1000
                }
        })

        await sequelize
            .authenticate()
            .then(async () => {
                console.log('Creating '+database+' database.');

                await sequelize.query("CREATE DATABASE " + database).then(async ([results, metadata]) => {
                    // Results will be an empty array and metadata will contain the number of affected rows.
                    console.log(results, metadata);

                    resolve();
                })
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err.original.code);
                resolve();
            });
    })

}

class Database{
    constructor(){
        return this;
    }

    async start(){
        //we start the mysql service. this means our database will be running in a shell process.
        await start_service();
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Database());
});