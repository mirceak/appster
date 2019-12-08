'use strict'

//appster modules
let utils;
let shell;
let sequelize;

//remote modules
let express;

//private vars
let router;

class Api {
    constructor() {
        return this;
    }

    async start() {
        if (!express) {
            express = await utils.require('express');
            sequelize = await utils.require('../../models/index.js');
            router = express.Router();
        }

        await shell.run_command('npx sequelize-cli db:migrate \n exit \n');

        await shell.run_command('npx sequelize-cli db:seed:undo:all \n exit \n');
        await shell.run_command('npx sequelize-cli db:seed:all \n exit \n');

        await sequelize.AppsterJSModule.findOne({where: {slug: 'appster_js_module_backend_remotes_module_main'}}).then(async result => {
            await eval(`(async ()=>{return await ${result.dataValues.code}})()`);
        })
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Api());
});