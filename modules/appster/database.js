'use strict'

//appster modules
let utils;
let shell;

//remote modules
var Sequelize;

//private vars

let start_service = async ()=>{
    return new Promise(async resolve => {
        let shell_process;
        if (await utils.file_exists('./3rdPartyFiles/mariadb10.4.10/data')){
            if(await utils.file_exists('./3rdPartyFiles/mariadb10.4.10/data/appster')){
                await start_mysql_service(shell_process);
            }else{
                await start_mysql_service(shell_process);
                await create_appster_database();
            }
        }else{
            console.log('Installing mysql databases.');
            await shell.run_command("cd 3rdPartyFiles/mariadb10.4.10/bin \n mysql_install_db start \n exit \n");
            await start_mysql_service(shell_process);

            await create_appster_database();
        }
        resolve();
    });
};

let start_mysql_service = async (shell_process) => {
    shell_process = await shell.run_command('.\\3rdPartyFiles\\mariadb10.4.10\\bin\\mysqld \n', true);

    shell_process.stderr.on('data', (data) => {
        if ((data.toString()+"").includes("starting as process")){
            console.log("APPSTER____________________________________________________________________________________________________mysql service started.");
        }
    });
}

let start_client = async ()=>{
    await hook_sequelize();
}

let create_appster_database = async ()=>{
    return new Promise(async resolve => {
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
                console.log('Creating appster database.');

                await sequelize.query("CREATE DATABASE appster").then(async ([results, metadata]) => {
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

let hook_sequelize = async ()=>{
    const sequelize = new Sequelize('appster', 'root', null, {
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
        Sequelize = await utils.require('sequelize');

        //we start the mysql service. this means our database will be running in a shell process.
        await start_service();

        //we start the database client. we use this to communicate with our database service.
        await start_client();
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Database());
});