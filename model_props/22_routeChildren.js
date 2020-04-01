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
        models.Route.belongsToMany(models.Route, {
            through: {
                model: 'RouteChildren',
                unique: false
            },
            as: 'Parents',
            constraints: false,
            foreignKey: 'siblingId'
        });
        models.Route.belongsToMany(models.Route, {
            through: {
                model: 'RouteChildren',
                unique: false
            },
            as: 'Siblings',
            constraints: false,
            foreignKey: 'parentId'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            return;
            await queryInterface.bulkInsert('RouteChildren', [], {});
        },

        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('RouteChildren', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'RouteChild',
        table: 'RouteChildren',
        seeder: seeder,
    }
})()