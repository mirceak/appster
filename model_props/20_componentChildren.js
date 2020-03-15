(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    childId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'components'
        },
        key: 'id'
      },
      allowNull: false
    },
    parentId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'components'
        },
        key: 'id'
      },
      allowNull: false
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
    models.Component.belongsToMany(models.Component, { through: 'ComponentChildren', as: 'Parents', foreignKey: 'parentId' });
    models.Component.belongsToMany(models.Component, { through: 'ComponentChildren', as: 'Siblings', foreignKey: 'childId' });
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