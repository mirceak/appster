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
        tableName: {
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
        models.Model.belongsTo(models.Script, {
            foreignKey: 'optionsId',
            as: 'Options'
        });
        models.Model.belongsTo(models.Script, {
            foreignKey: 'fieldsId',
            as: 'Fields'
        });
        models.Model.belongsTo(models.Script, {
            foreignKey: 'attributesId',
            as: 'Attributes'
        });
        models.Model.belongsTo(models.Script, {
            foreignKey: 'associateId',
            as: 'Associate'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            return;
            return queryInterface.bulkInsert('Models', [
                {
                    name: 'Guard',
                    fields: 1,
                    props: 2,
                    tableName: `Guards`,
                    type: 'model_table',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ], {});
        },


        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('Models', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'Model',
        table: 'Models',
        seeder: seeder,
    }
})()