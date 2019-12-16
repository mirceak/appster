'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [
          {
              username: "1",
              password: "1",
              createdAt: new Date(),
              updatedAt: new Date()
          }
      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {}, {});
  }
};
