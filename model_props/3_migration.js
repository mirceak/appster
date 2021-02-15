(() => {

    var attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: 'INTEGER'
        },
        index: {
            allowNull: false,
            type: 'INTEGER'
        },
        type: {
            allowNull: false,
            type: 'STRING'
        },
        ran: {
            allowNull: false,
            type: 'BOOLEAN'
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
        models.Migration.belongsTo(models.Script, {
            foreignKey: 'javascriptId',
            constraints: false,
            as: 'Javascript'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            return;
            return queryInterface.bulkInsert('Migrations', [], {});
        },

        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('Migrations', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'Migration',
        table: 'Migrations',
        seeder: seeder,
    }
})()
