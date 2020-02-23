'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mainBackendModuleId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'modules'
          },
          key: 'id'
        },
        allowNull: false,
      },
      mainFrontendModuleId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'modules'
          },
          key: 'id'
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Settings');
  }
};