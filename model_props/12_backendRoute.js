(() => {
    var attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: 'INTEGER'
        },
        name: {
            unique: true,
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

    var options = {}

    var associate = function (models) {
        // associations can be defined here
        models.BackendRoute.belongsTo(models.Route, {
            foreignKey: 'routeId',
            constraints: false,
            as: 'Route'
        });
        models.BackendRoute.belongsTo(models.Module, {
            foreignKey: 'moduleId',
            constraints: false,
            as: 'Module'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            await queryInterface.bulkInsert('BackendRoutes', [
                {
                    name: 'root',
                    type: 'root_page',
                    routeId: (await Sequelize.Route.findOne({where: {name: 'root'}})).id,
                    moduleId: (await Sequelize.Module.findOne({where: {name: 'routeModuleRootPage'}})).id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'login',
                    type: 'root_page',
                    routeId: (await Sequelize.Route.findOne({where: {name: 'login'}})).id,
                    moduleId: (await Sequelize.Module.findOne({where: {name: 'routeModuleLoginPage'}})).id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'admin',
                    type: 'root_page',
                    routeId: (await Sequelize.Route.findOne({where: {name: 'admin'}})).id,
                    moduleId: (await Sequelize.Module.findOne({where: {name: 'routeModuleAdminPage'}})).id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ], {});
        },


        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('BackendRoutes', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'BackendRoute',
        table: 'BackendRoutes',
        seeder: seeder,
    }
})()