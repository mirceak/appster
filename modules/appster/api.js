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
                var keys = Object.keys(modelModule.fields);
                for (var field of keys){
                    field = modelModule.fields[field];

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

                const Model = sequelize.define(modelModule.name, modelModule.fields, modelModule.options);
                Model.associate = modelModule.associate;
                return Model;
            }

            await fs
                .readdirSync(root + '\\model_props')
                .filter(async file => {
                    return await (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
                })
                .reduce(async (result, file) => {
                    var modelModule = await eval('(async ()=>{return await (' + (await utils.get_file_content(root + '\\model_props\\' + file)).toString() + ')})()');
                    sequelize[modelModule.name] = parseModel(modelModule);
                    modelModule.fileName = file;
                    models.push(modelModule);
                    return result;
                }, null);

            models.sort((a,b) => (parseInt(a.fileName.substr(0, a.fileName.indexOf('_'))) > parseInt(b.fileName.substr(0, b.fileName.indexOf('_')))) ? 1 : ((parseInt(b.fileName.substr(0, b.fileName.indexOf('_'))) > parseInt(a.fileName.substr(0, a.fileName.indexOf('_')))) ? -1 : 0));

            for (var i=models.length-1; i>=0; i--){
                var model = models[i];
                await sequelize.getQueryInterface().dropTable(model.table);
            }
            for (var i=0; i<models.length; i++){
                var model = models[i];
                await sequelize.getQueryInterface().createTable(model.table, model.attributes);
            }
            for (var i=0; i<models.length; i++){
                var model = models[i];
                console.log(model.name);
                if (model.associate) {
                    await model.associate(sequelize);
                }
            }
            for (var i=0; i<models.length; i++){
                var model = models[i];
                await model.seeder.up(sequelize.getQueryInterface(), sequelize);
            }

            return {
                async undoMigrations(){

                },
                async runMigrations(){
                    await sequelize.Settings.findAll({
                        include:[
                            {
                                all: true,
                                nested: true
                            }
                        ]
                    })
                },
                async undoSeeders(){

                },
                async runSeeders(){

                }
            }
        })();

        await databaseModule.runMigrations();

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