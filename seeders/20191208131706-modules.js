'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Modules', [
            {
                name: 'mainBackend',
                javascriptId: 5,
                type: 'module',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'mainFrontend',
                javascriptId: 6,
                type: 'module',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'databaseManager',
                javascriptId: 7,
                type: 'module',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Modules', {/*slug: {[Sequelize.Op.like]: "appster_js_module_%"}*/}, {});
    }
};
