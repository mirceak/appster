(()=>{
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

  var fields = Object.assign({

  }, attributes);

  var options = {

  }

  var associate = function(models) {
    // associations can be defined here
    models.Component.belongsToMany(models.Component, { through: 'ComponentChildren', as: 'Parents', foreignKey: 'siblingId' });
    models.Component.belongsToMany(models.Component, { through: 'ComponentChildren', as: 'Siblings', foreignKey: 'parentId' });
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      return;
      await queryInterface.bulkInsert('ComponentChildren', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('ComponentChildren', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'ComponentChild',
    table: 'ComponentChildren',
    seeder: seeder,
  }
})()