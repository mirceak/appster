'use strict'

//appster modules
let utils;
let shell;
let sequelize;
let entity_register;

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
    sequelize = require('../../models/index.js');
    entity_register = await require('./entities/entity_register.js');

    resolve(new Api());
});