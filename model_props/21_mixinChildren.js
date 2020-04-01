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
        models.Mixin.belongsToMany(models.Mixin, {
            through: 'MixinChildren',
            as: 'Parents',
            foreignKey: 'siblingId'
        });
        models.Mixin.belongsToMany(models.Mixin, {
            through: 'MixinChildren',
            as: 'Siblings',
            foreignKey: 'parentId'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            return;
            await queryInterface.bulkInsert('MixinChildren', [], {});
        },

        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('MixinChildren', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'MixinChild',
        table: 'MixinChildren',
        seeder: seeder,
    }
})()