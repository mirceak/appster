'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Models', [
            // {
            //     name: 'Script',
            //     fields: 1,
            //     props: 2,
            //     tableName: `Scripts`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'Settings',
            //     fields: 3,
            //     props: 4,
            //     tableName: `Settings`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'Module',
            //     props: JSON.stringify({
            //
            //     }),
            //     fields: JSON.stringify({
            //
            //     }),
            //     tableName: `Modules`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'Migration',
            //     props: JSON.stringify({
            //
            //     }),
            //     fields: JSON.stringify({
            //
            //     }),
            //     tableName: `Migrations`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            {
                name: 'Guard',
                props: JSON.stringify({

                }),
                fields: JSON.stringify({

                }),
                tableName: `Guards`,
                type: 'model_table',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // {
            //     name: 'Component',
            //     props: JSON.stringify({
            //
            //     }),
            //     fields: JSON.stringify({
            //
            //     }),
            //     tableName: `Components`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'Mixin',
            //     props: JSON.stringify({
            //
            //     }),
            //     fields: JSON.stringify({
            //
            //     }),
            //     tableName: `Mixins`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'Route',
            //     props: JSON.stringify({
            //
            //     }),
            //     tableName: `Routes`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'User',
            //     props: JSON.stringify({
            //
            //     }),
            //     tableName: `Users`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'Role',
            //     props: JSON.stringify({
            //
            //     }),
            //     tableName: `Roles`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'model_table',
            //     props: JSON.stringify({
            //
            //     }),
            //     tableName: `Models`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     name: 'Column',
            //     props: JSON.stringify({
            //
            //     }),
            //     tableName: `Columns`,
            //     type: 'model_table',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
        ], {});
    },


    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Models', {/*slug: {[Sequelize.Op.like]: "appster_js_module_%"}*/}, {});
    }
};
