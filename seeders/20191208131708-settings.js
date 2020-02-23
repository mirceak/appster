'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Settings', [
            {
                mainBackendModuleId: 1,
                mainFrontendModuleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },


    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Settings', {/*slug: {[Sequelize.Op.like]: "appster_js_module_%"}*/}, {});
    }
};
