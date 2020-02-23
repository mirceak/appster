'use strict'

//appster modules
let utils;
let shell;

//remote modules
let sequelize;

//private vars

class Api {
    constructor() {
        return this;
    }

    async start() {
        sequelize = await utils.require('../../models/index.js');

        await shell.run_command('npx sequelize-cli db:migrate:undo:all \n exit \n');
        await shell.run_command('npx sequelize-cli db:migrate \n exit \n');

        await shell.run_command('npx sequelize-cli db:seed:undo:all \n exit \n');
        await shell.run_command('npx sequelize-cli db:seed:all \n exit \n');

        var appster = {
            proxyModule: async (module)=>{
                return {
                    compiled: await eval('(async ()=>{return await (' + module + ')})()')
                };
            }
        };
        appster.settings = await sequelize.Settings.findOne({
            include:[
                {
                    all: true,
                    nested: true
                }
            ]
        });

        await appster.proxyModule(appster.settings.mainBackendModule.javascript.code);
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Api());
});