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
        models.Mixin.belongsTo(models.Script, {
            foreignKey: 'javascriptId',
            constraints: false,
            as: 'Javascript'
        });
    }

    var seeder = {
        up: async (queryInterface, Sequelize) => {
            await queryInterface.bulkInsert('Mixins', [
                {
                    name: 'AdminAccordionSidebarButtonMixin',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'AdminComponentAccordionSidebarButtonMixin'}})).id,
                    type: 'component',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'AdminSidebarToolsMixin',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'AdminComponentSidebarToolsMixin'}})).id,
                    type: 'component',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'AdminDatabaseModelsMixin',
                    javascriptId: (await Sequelize.Script.findOne({where: {name: 'AdminComponentDatabaseModelsMixin'}})).id,
                    type: 'component',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ], {});

            var mixin = await Sequelize.Mixin.findOne({where: {name: 'AdminAccordionSidebarButtonMixin'}});
            // await mixin.addSibling( (await Sequelize.Mixin.findOne({where:{name: 'AdminAccordionSidebarButtonMixinTest'}})) );
        },


        down: (queryInterface, Sequelize) => {
            return queryInterface.bulkDelete('Mixins', {}, {});
        }
    };

    return {
        fields: fields,
        attributes: attributes,
        options: options,
        associate: associate,
        name: 'Mixin',
        table: 'Mixins',
        seeder: seeder,
    }
})()