'use strict'

//appster modules
let utils;
let entity_register;

//remote modules
let express;
let Sequelize;

//private vars
let router;

class Api {
    constructor() {
        return this;
    }

    async start() {if (!express) {
        Sequelize = await utils.require('sequelize');
        express = await utils.require('express');
        router = express.Router();
    }
        const sequelize = new Sequelize('appster', 'root', null, {
            dialect: 'mariadb',
            dialectOptions:
                {
                    connectTimeout: 1000
                }
        })

        await sequelize.authenticate().then(async () => {
            entity_register = await entity_register.get(sequelize);

            await entity_register[0].model.findOne({where: {slug: 'appster_js_module_backend_remotes_module_main'}}).then(async result => {
                await eval(`(async ()=>{return await ${result.dataValues.code}})()`);
            })
        })
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    entity_register = await require('./entities/entity_register.js');

    resolve(new Api());
});