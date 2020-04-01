(() => {
    var attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
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
    }

    var fields = Object.assign({}, attributes);

    var options = {}

    var associate = function (models) {
        // associations can be defined here
        models.Settings.belongsTo(models.Module, {
            foreignKey: 'mainBackendModuleId',
            as: 'MainBackendModule'
        });
        models.Settings.belongsTo(models.Module, {
            foreignKey: 'mainFrontendModuleId',
            as: 'MainFrontendModule'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            await queryInterface.bulkInsert('Settings', [
                {
                    mainBackendModuleId: (await Sequelize.Module.findOne({where: {name: 'mainBackend'}})).id,
                    mainFrontendModuleId: (await Sequelize.Module.findOne({where: {name: 'mainFrontend'}})).id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ], {});
        },


        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('Settings', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'Settings',
        table: 'Settings',
        seeder: seeder,
    }
})()