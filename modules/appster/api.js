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
                var keys = Object.keys(module.fields);
                for (var field of keys){
                    field = module.fields[field];

                    var type = null;
                    var option = null;
                    if (field.type.includes('(')){
                        type = field.type.split('(')[0];
                        option = field.type.split('(')[1].replace(')','');
                    }else{
                        type = field.type;
                    }

                    if (option){
                        field.type = Sequelize[type](option);
                    }else{
                        field.type = Sequelize[type];
                    }
                };
                keys = Object.keys(module.attributes);
                for (field of keys){
                    field = module.attributes[field];

                    var type = null;
                    var option = null;
                    if (field.type.includes('(')){
                        type = field.type.split('(')[0];
                        option = field.type.split('(')[1].replace(')','');
                    }else{
                        type = field.type;
                    }

                    if (option){
                        field.type = Sequelize[type](option);
                    }else{
                        field.type = Sequelize[type];
                    }
                };

                const Model = sequelize.define(module.name, module.fields, module.options);
                Model.associate = module.associate;
                module.Model = Model;
                return module;
            }

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
                    return result;
                }, null);

            models.sort((a,b) => (parseInt(a.fileName.substr(0, a.fileName.indexOf('_'))) > parseInt(b.fileName.substr(0, b.fileName.indexOf('_')))) ? 1 : ((parseInt(b.fileName.substr(0, b.fileName.indexOf('_'))) > parseInt(a.fileName.substr(0, a.fileName.indexOf('_')))) ? -1 : 0));

            for (var i=0; i<models.length; i++){
                var model = models[i];
                await model.associate(sequelize);
            }

            return {
                async undoMigrations(){
                    for (var i=models.length-1; i>=0; i--){
                        var model = models[i];
                        await sequelize.getQueryInterface().dropTable(model.table);
                    }
                },
                async runMigrations(){
                    for (var i=0; i<models.length; i++){
                        var model = models[i];
                        await sequelize.getQueryInterface().createTable(model.table, model.module.attributes);
                    }
                },
                async undoSeeders(){
                    for (var i=0; i<models.length; i++){
                        var model = models[i];
                        await model.seeder.down(sequelize.getQueryInterface(), sequelize);
                    }
                },
                async runSeeders(){
                    for (var i=0; i<models.length; i++){
                        var model = models[i];
                        await model.seeder.up(sequelize.getQueryInterface(), sequelize);
                    }
                },
                async registerModels(){
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

        await databaseModule.undoMigrations();
        await databaseModule.runMigrations();
        await databaseModule.registerModels();
        await databaseModule.runSeeders();

        var appster = {
            proxyModule: async (module)=>{
                return await eval('(async ()=>{return await (' + module + ')})()');
            },
            settings: await sequelize.Settings.findOne({
                include:[
                    {
                        all: true,
                        nested: true
                    }
                ]
            })
        };

        await appster.proxyModule(appster.settings.mainBackendModule.javascript.code);
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Api());
});