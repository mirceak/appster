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
        models.Guard.belongsTo(models.Module, {
            constraints: false,
            foreignKey: 'moduleId', as: 'Module'
        });
        models.Guard.belongsTo(models.Route, {
            constraints: false,
            foreignKey: 'moduleId', as: 'Route'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            await queryInterface.bulkInsert('Guards', [
                {
                    name: 'auth',
                    type: 'user',
                    moduleId: (await Sequelize.Module.findOne({where: {name: 'authGuard'}})).id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ], {});

            var authGuard = await Sequelize.Guard.findOne({where: {name: 'auth', type: 'user'}})
            authGuard.addRole(await Sequelize.Role.findOne({where: {name: 'auth', type: 'user'}}))
        },


        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('Guards', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'Guard',
        table: 'Guards',
        seeder: seeder,
    }
})()