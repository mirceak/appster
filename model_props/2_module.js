(() => {
    var attributes = {
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
    }

    var fields = Object.assign({}, attributes);

    var options = {
        scopes: {
            appster_modules: {
                where: {
                    type: 'appster_module'
                }
            }
        },
        indexes: [
            {
                unique: true,
                fields: ['name', 'type']
            }
        ]
    }

    var associate = function (models) {
        // associations can be defined here
        models.Module.belongsTo(models.Script, {
            foreignKey: 'javascriptId',
            constraints: false,
            as: 'Javascript'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            await queryInterface.bulkInsert('Modules', [
                {
                    name: 'mainBackend',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'mainBackendModule'}})).id,
                    type: 'kernel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'appsterConfig',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'appsterConfigModule'}})).id,
                    type: 'appster_module',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'appsterRouter',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'appsterRouterModule'}})).id,
                    type: 'appster_module',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'appsterLoginScaffold',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'appsterLoginScaffoldModule'}})).id,
                    type: 'appster_module',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'mainFrontend',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'mainFrontendModule'}})).id,
                    type: 'kernel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'authGuard',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'authGuardModule'}})).id,
                    type: 'appster_module',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'routeModuleRootPage',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'routeModuleControllerModule'}})).id,
                    type: 'appster_module',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'routeModuleLoginPage',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'routeModuleLoginPageControllerModule'}})).id,
                    type: 'appster_module',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'routeModuleAdminPage',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'routeModuleControllerModule'}})).id,
                    type: 'appster_module',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'routeModuleController',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'routeModuleControllerModule'}})).id,
                    type: 'appster_module',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ], {});
        },

        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('Modules', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'Module',
        table: 'Modules',
        seeder: seeder,
    }
})()