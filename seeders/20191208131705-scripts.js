'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Scripts', [
            {
                name: 'scriptsFields',
                code: JSON.stringify({
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: 'INTEGER'
                    },
                    name: {
                        allowNull: false,
                        type: 'STRING'
                    },
                    script: {
                        allowNull: false,
                        type: 'STRING(20000)'
                    },
                    type: {
                        allowNull: false,
                        type: 'STRING'
                    },
                    createdAt: {
                        allowNull: false,
                        type: 'DATE'
                    },
                    updatedAt: {
                        allowNull: false,
                        type: 'DATE'
                    }
                }),
                type: 'jsonObject',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'scriptsProps',
                code: JSON.stringify({

                }),
                type: 'jsonObject',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'settingsFields',
                code: JSON.stringify({
                    id: {
                        allow_null: false,
                        unique: true,
                        auto_increment: true,
                        primary_key: true,
                        type: 'INTEGER'
                    },
                    userId: {
                        references: {
                            model: {
                                tableName: 'users'
                            },
                            key: 'id'
                        },
                        allow_null: false,
                        unique: true,
                        type: 'INTEGER'
                    },
                    mainBackendModule: {
                        references: {
                            model: {
                                tableName: 'modules'
                            },
                            key: 'id'
                        },
                        allow_null: false,
                        unique: true,
                        type: 'INTEGER'
                    },
                    mainFrontendModule: {
                        references: {
                            model: {
                                tableName: 'modules'
                            },
                            key: 'id'
                        },
                        allow_null: false,
                        unique: true,
                        type: 'INTEGER'
                    },
                    createdAt: {
                        allowNull: false,
                        type: 'DATE'
                    },
                    updatedAt: {
                        allowNull: false,
                        type: 'DATE'
                    }
                }),
                type: 'jsonObject',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'settingsProps',
                code: JSON.stringify({

                }),
                type: 'jsonObject',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'mainBackendModule',
                code: `
                    (async ()=>{                        
                        let cors = await utils.require('cors');
                        let bodyParser = require("body-parser");
                        let cookieParser = require("cookie-parser");
                        let session = await utils.require('express-session');
                        let passport = await utils.require('passport')
                        let crypto = await utils.require('crypto');
                        let MySQLStore = (await utils.require('express-mysql-session'))(session);
                        let LocalStrategy = (await utils.require('passport-local')).Strategy;
                        let config = require('../../config/appster_config.js');
                        
                        let express = await utils.require('express');
                        let passwordHash = await utils.require('password-hash');
                        
                        let appsterApiRouter = express.Router();
                        let frontEndRouter = express.Router();
                        
                        var appsterApi = express();    
                        var proxyModule = async (module)=>{
                            return {
                                guards: module.guards ? JSON.parse(module.guards) : undefined,
                                compiled: await eval('(async ()=>{return await ' + module.code + '})()')
                            };
                        };
                        
                        var remoteModule = async (name)=>{
                            return new Promise(async _resolve=>{
                                await sequelize.Module.findOne({where:{name: name, type: 'module'}}).then(async result=>{    
                                    _resolve(await proxyModule(result.dataValues));
                                })
                            })
                        };
                        console.log(1);
                    })()
                `,
                type: 'javascript',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'mainFrontentModule',
                code: `
                    (async ()=>{
                        console.log(1);
                    })()
                `,
                type: 'javascript',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Scripts', {/*slug: {[Sequelize.Op.like]: "appster_js_module_%"}*/}, {});
    }
};
