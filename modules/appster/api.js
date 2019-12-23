'use strict'

//appster modules
let utils;
let shell;
let cors;
let bodyParser;
let cookieParser;
let session;
let passport;
let crypto;
let MySQLStore;
let LocalStrategy;
let config = require('../../config/appster_config.js');
let sequelize;

//remote modules
let express;

//private vars
let appsterApiRouter;
let frontEndRouter;

class Api {
    constructor() {
        return this;
    }

    async start() {
        if (!express) {
            express = await utils.require('express');
            session = await utils.require('express-session');
            passport = await utils.require('passport');
            MySQLStore = (await utils.require('express-mysql-session'))(session);
            LocalStrategy = (await utils.require('passport-local')).Strategy;
            crypto = await utils.require('crypto');
            cors = await utils.require('cors');
            bodyParser = require("body-parser");
            cookieParser = require("cookie-parser");
            sequelize = await utils.require('../../models/index.js');
            appsterApiRouter = express.Router();
            frontEndRouter = express.Router();
        }

        await shell.run_command('npx sequelize-cli db:migrate:undo:all \n exit \n');
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