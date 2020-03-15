'use strict'

//appster modules
let utils;
let shell;

//remote modules
let Sequelize;

//private vars
let sequelize;

class Api {
    constructor() {
        return this;
    }

    async start() {
        var databaseModule = await (async ()=>{
            const root = await require('path').dirname(require.main.filename || process.mainModule.filename);
            const DataTypes = await require('mysql');
            Sequelize = await utils.require('sequelize');
            const env = process.env.NODE_ENV || 'development';
            const config = JSON.parse((await utils.get_file_content(root + '\\config\\config.json')).toString()).development;
            sequelize = new Sequelize(config.database, config.username, config.password, config);
            var models = [];

            const fs = require('fs');

            var parseModel = (modelModule)=>{
                var module = JSON.parse(JSON.stringify(modelModule));

                var type = null;
                var option = null;
                var getSequelizeDataType = (field) => {
                    type = null;
                    option = null;

                    if (field.type.includes('(')){
                        type = field.type.split('(')[0];
                        option = field.type.split('(')[1].replace(')','');
                    }else{
                        type = field.type;
                    }

                    if (option){
                        return Sequelize[type](option);
                    }else{
                        return Sequelize[type];
                    }
                };

                var keys = Object.keys(module.fields);
                for (var field of keys){
                    field = module.fields[field];
                    field.type = getSequelizeDataType(field);
                };

                keys = Object.keys(module.attributes);
                for (field of keys){
                    field = module.attributes[field];
                    field.type = getSequelizeDataType(field);
                };

                const Model = sequelize.define(module.name, module.fields, module.options);
                Model.associate = module.associate;
                module.Model = Model;
                return module;
            }

            sequelize.models = [];
            await fs
                .readdirSync(root + '\\model_props')
                .filter(async file => {
                    return await (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
                })
                .reduce(async (result, file) => {
                    var modelModule = await eval('(async ()=>{return await (' + (await utils.get_file_content(root + '\\model_props\\' + file)).toString() + ')})()');
                    modelModule.module = parseModel(modelModule);
                    sequelize[modelModule.name] = modelModule.module.Model;
                    modelModule.fileName = file;
                    models.push(modelModule);
                    sequelize.models.push(modelModule);
                    return result;
                }, null);

            models.sort((a,b) => (parseInt(a.fileName.substr(0, a.fileName.indexOf('_'))) > parseInt(b.fileName.substr(0, b.fileName.indexOf('_')))) ? 1 : ((parseInt(b.fileName.substr(0, b.fileName.indexOf('_'))) > parseInt(a.fileName.substr(0, a.fileName.indexOf('_')))) ? -1 : 0));


            for (var i=0; i<models.length; i++){
                var model = models[i];
                await model.associate(sequelize);
            }

            return {
                async undoKernelMigrations_debug(){
                    var migrations = await sequelize.Migration.findAll({
                        include:[
                            {
                                all: true
                            }
                        ]
                    }).then(async results => {
                        for (var i=results.length-1; i>=0; i++){
                            var migrationModule = eval('(' + results[i].javascript.code + ')');
                            await migrationModule.down(sequelize.getQueryInterface(), sequelize);
                        }
                    })
                },
                async runKernelMigrations(){
                    for (var i=0; i<models.length; i++){
                        var model = models[i];
                        await sequelize.getQueryInterface().createTable(model.table, model.module.attributes);
                    }
                },
                async runKernelSeeders(){
                    for (var i=0; i<models.length; i++){
                        var model = models[i];
                        const migrationCode = await sequelize.Script.create({
                            name: 'model_' + model.name + '_initial_seeder',
                            code: `{
                                up: (queryInterface, Sequelize) => {
                                    return queryInterface.createTable(${model.table}, ${JSON.stringify(model.attributes)});
                                },
                                down: (queryInterface, Sequelize) => {
                                    return queryInterface.dropTable(${model.table});
                                }
                            }`,
                            type: "seeder",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        const migration = await sequelize.Migration.create({
                            javascriptId: migrationCode.id,
                            index: migrationCode.id - 1,
                            type: "kernel_table_seeder",
                            ran: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });

                        await model.seeder.up(sequelize.getQueryInterface(), sequelize);
                    }
                },
                async registerKernelModels(){
                    for (var i=0; i<models.length; i++){
                        var model = models[i];
                        const fields = await sequelize.Script.create({
                            name: 'model_' + model.name + '_fields',
                            code: JSON.stringify(model.fields),
                            type: "json",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        const attributes = await sequelize.Script.create({
                            name: 'model_' + model.name + '_attributes',
                            code: JSON.stringify(model.attributes),
                            type: "json",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        const migrationCode = await sequelize.Script.create({
                            name: 'model_' + model.name + '_initial_migration',
                            code: `{
                                up: (queryInterface, Sequelize) => {
                                    return queryInterface.createTable(${model.table}, ${JSON.stringify(model.attributes)});
                                },
                                down: (queryInterface, Sequelize) => {
                                    return queryInterface.dropTable(${model.name});
                                }
                            }`,
                            type: "migration",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        const migration = await sequelize.Migration.create({
                            javascriptId: migrationCode.id,
                            index: migrationCode.id - 1,
                            type: "kernel_table",
                            ran: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        const associate = await sequelize.Script.create({
                            name: 'model_' + model.name + '_associate',
                            code: model.associate.toString(),
                            type: "javascript",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        const options = await sequelize.Script.create({
                            name: 'model_' + model.name + '_options',
                            code: model.options.toString(),
                            type: "javascript",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        const db_model = await sequelize.Model.create({
                            name: model.name,
                            tableName: model.table,
                            fieldsId: fields.id,
                            attributesId: attributes.id,
                            optionsId: options ? options.id : null,
                            associateId: associate.id,
                            type: "kernel_table",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                    }
                }
            }
        })();
        var settings;

        settings = await sequelize.Settings.findOne().catch(async error => {
            await databaseModule.runKernelMigrations();
            await databaseModule.registerKernelModels();
            await databaseModule.runKernelSeeders();
            return settings = await sequelize.Settings.findOne()
        });

        var appster = {
            config: await utils.require('../../config/appster_config.js'),
            proxyModule: async (module)=>{
                return await eval(module);
            },
            settings: settings
        };

        await appster.settings.getMainBackendModule().then(async response => {
            return response.getJavascript().then(async response => {
                await appster.proxyModule(response.code);
            })
        })
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Api());
});